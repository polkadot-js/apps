// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartOptions, ChartTypeRegistry, TooltipItem } from 'chart.js';
import type { TFunction } from 'react-i18next';
import type { PalletConvictionVotingTally, PalletRankedCollectiveTally, PalletReferendaReferendumInfoConvictionVotingTally, PalletReferendaReferendumInfoRankedCollectiveTally } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { BaseReferendumProps as Props, CurveGraph, ReferendumProps } from '../types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Chart, Columar, ExpandButton, LinkExternal } from '@polkadot/react-components';
import { useBestNumber, useBlockInterval, useToggle } from '@polkadot/react-hooks';
import { calcBlockTime } from '@polkadot/react-hooks/useBlockTime';
import { BN_MILLION, BN_THOUSAND, BN_ZERO, bnToBn, formatNumber, objectSpread } from '@polkadot/util';

import { useTranslation } from '../translate';
import Killed from './RefKilled';
import Ongoing from './RefOngoing';
import Tuple from './RefTuple';

const COMPONENTS: Record<string, React.ComponentType<ReferendumProps>> = {
  Killed,
  Ongoing
};

const VAL_COLORS = ['#ff8c00', '#9c3333', '#339c33'];
const BOX_COLORS = ['rgba(140, 140, 140, 0.2)', 'rgba(140, 0, 0, 0.2)', 'rgba(0, 140, 0, 0.2)'];
const PT_CUR = 0;
const PT_NEG = 1;
const PT_POS = 2;

const OPTIONS: ChartOptions = {
  animation: {
    duration: 0
  },
  aspectRatio: 2.25,
  elements: {
    point: {
      hoverRadius: 6,
      radius: 0
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  maintainAspectRatio: true,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

interface ChartResult {
  progress: {
    percent: number;
    value: BN;
    total: BN;
  };
  labels: string[];
  values: number[][];
}

interface ChartResultExt extends ChartResult {
  changeX: number;
  currentY: number;
  since: BN;
  trackGraph: CurveGraph;
}

interface ChartProps extends ChartResult {
  colors: string[];
  options: typeof OPTIONS;
}

function tooltipTitle (bestNumber: BN, blockInterval: BN, t: TFunction): (items: TooltipItem<keyof ChartTypeRegistry>[]) => string | string[] {
  return (items: TooltipItem<keyof ChartTypeRegistry>[]): string | string[] => {
    const label = items[0].label;

    try {
      const blocks = bnToBn(label.replace(/,/g, '')).sub(bestNumber);

      if (blocks.gt(BN_ZERO)) {
        const when = new Date(Date.now() + blocks.mul(blockInterval).toNumber()).toLocaleString();
        const calc = calcBlockTime(blockInterval, blocks, t);

        return [`#${label}`, t('{{when}} (est.)', { replace: { when } }), calc[1]];
      }
    } catch {
      // ignore
    }

    return `#${label}`;
  };
}

function getChartResult (totalEligible: BN, isConvictionVote: boolean, info: PalletReferendaReferendumInfoConvictionVotingTally | PalletReferendaReferendumInfoRankedCollectiveTally, trackGraph: CurveGraph): ChartResultExt[] | null {
  if (totalEligible && isConvictionVote && info.isOngoing) {
    const ongoing = info.asOngoing;

    if (ongoing.deciding.isSome) {
      const { approval, support, x } = trackGraph;
      const { deciding, tally } = ongoing;
      const { since } = deciding.unwrap();
      const currentSupport = isConvictionVote
        ? (tally as PalletConvictionVotingTally).support
        : (tally as PalletRankedCollectiveTally).bareAyes;
      const labels: string[] = [];
      const values: number[][][] = [[[], [], []], [[], [], []]];
      const supc = totalEligible.isZero()
        ? 0
        : currentSupport.mul(BN_THOUSAND).div(totalEligible).toNumber() / 10;
      const appc = tally.ayes.isZero()
        ? 0
        : tally.ayes.mul(BN_THOUSAND).div(tally.ayes.add(tally.nays)).toNumber() / 10;
      let appx = -1;
      let supx = -1;

      for (let i = 0; i < approval.length; i++) {
        labels.push(formatNumber(since.add(x[i])));

        const appr = approval[i].div(BN_MILLION).toNumber() / 10;
        const appn = appc < appr;

        values[0][PT_CUR][i] = appr;
        values[0][appn ? PT_NEG : PT_POS][i] = appc;
        appx = (appn || appx !== -1) ? appx : i;

        const supr = support[i].div(BN_MILLION).toNumber() / 10;
        const supn = supc < supr;

        values[1][PT_CUR][i] = supr;
        values[1][supn ? PT_NEG : PT_POS][i] = supc;
        supx = (supn || supx !== -1) ? supx : i;
      }

      return [
        { changeX: appx, currentY: appc, labels, progress: { percent: appc, total: ongoing.tally.ayes.add(ongoing.tally.nays), value: ongoing.tally.ayes }, since, trackGraph, values: values[0] },
        { changeX: supx, currentY: supc, labels, progress: { percent: supc, total: totalEligible, value: currentSupport }, since, trackGraph, values: values[1] }
      ];
    }
  }

  return null;
}

function getChartProps (bestNumber: BN, chartProps: ChartResultExt[], tooltipTitle: (items: TooltipItem<keyof ChartTypeRegistry>[]) => string | string[]): ChartProps[] {
  return chartProps.map(({ changeX, currentY, labels, progress, since, trackGraph: { x }, values }, index): ChartProps => {
    const maxX = labels.length;
    const currentX = maxX * (
      bestNumber.sub(since.add(x[0])).toNumber() / x[x.length - 1].sub(x[0]).toNumber()
    );
    const swapX = changeX === -1
      ? -1
      : maxX * (changeX / x.length);

    return {
      colors: VAL_COLORS,
      labels,
      options: objectSpread({
        plugins: {
          annotation: {
            annotations: objectSpread(
              {
                negative: {
                  backgroundColor: BOX_COLORS[1],
                  borderWidth: 0,
                  type: 'box',
                  xMax: swapX === -1
                    ? maxX
                    : swapX,
                  xMin: 0,
                  yMax: currentY,
                  yMin: 0
                },
                past: {
                  backgroundColor: BOX_COLORS[0],
                  borderWidth: 0,
                  type: 'box',
                  xMax: currentX,
                  xMin: 0,
                  yMax: index === 0
                    ? 100
                    : 50,
                  yMin: 0
                }
              },
              swapX !== -1
                ? {
                  positive: {
                    backgroundColor: BOX_COLORS[2],
                    borderWidth: 0,
                    type: 'box',
                    xMax: maxX,
                    xMin: swapX,
                    yMax: currentY,
                    yMin: 0
                  }
                }
                : {}
            )
          },
          tooltip: {
            callbacks: {
              title: tooltipTitle
            }
          }
        }
      }, OPTIONS),
      progress,
      values
    };
  });
}

function Referendum (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const bestNumber = useBestNumber();
  const blockInterval = useBlockInterval();
  const { activeIssuance, className = '', palletReferenda, value: { id, info, isConvictionVote, trackGraph } } = props;
  const [isExpanded, toggleExpanded] = useToggle(false);

  const Component = useMemo(
    () => COMPONENTS[info.type] || Tuple,
    [info]
  );

  const chartResult = useMemo(
    () => activeIssuance && trackGraph && getChartResult(activeIssuance, isConvictionVote, info, trackGraph),
    [activeIssuance, info, isConvictionVote, trackGraph]
  );

  const chartProps = useMemo(
    () => bestNumber && chartResult && getChartProps(bestNumber, chartResult, tooltipTitle(bestNumber, blockInterval, t)),
    [bestNumber, blockInterval, chartResult, t]
  );

  const chartLegend = useMemo(
    () => [
      [
        t<string>('minimum approval'),
        t<string>('current approval (failing)'),
        t<string>('current approval (passing)')
      ],
      [
        t<string>('minimum support'),
        t<string>('current support (failing)'),
        t<string>('current support (passing)')
      ]
    ],
    [t]
  );

  return (
    <>
      <tr className={`${className}${chartProps && isExpanded ? ' noBorder' : ''}`}>
        <td className='number'>
          <h1>{formatNumber(id)}</h1>
        </td>
        <Component
          isExpanded={isExpanded}
          toggleExpanded={toggleExpanded}
          {...props}
        />
        <td className='links media--1000'>
          <LinkExternal
            data={id}
            type={palletReferenda}
          />
        </td>
        <td className='links media--1000'>
          {chartProps && (
            <ExpandButton
              expanded={isExpanded}
              onClick={toggleExpanded}
            />
          )}
        </td>
      </tr>
      <tr className={`${className} ${chartProps && isExpanded ? 'isExpanded' : 'isCollapsed'}`}>
        {chartProps && isExpanded && (
          <td colSpan={10}>
            <Columar>
              <Columar.Column className='chartColumn'>
                <h1>{t<string>('approval / {{percent}}%', { replace: { percent: chartProps[0].progress.percent.toFixed(1) } })}</h1>
                <Chart.Line
                  legends={chartLegend[0]}
                  {...chartProps[0]}
                />
              </Columar.Column>
              <Columar.Column className='chartColumn'>
                <h1>{t<string>('support / {{percent}}%', { replace: { percent: chartProps[1].progress.percent.toFixed(1) } })}</h1>
                <Chart.Line
                  legends={chartLegend[1]}
                  {...chartProps[1]}
                />
              </Columar.Column>
            </Columar>
          </td>
        )}
      </tr>
    </>
  );
}

export default React.memo(styled(Referendum)`
  .chartColumn {
    h1 {
      font-size: 1.25rem;
      margin-bottom: 0;
      margin-top: 1rem;
      text-align: center;
    }
  }
`);
