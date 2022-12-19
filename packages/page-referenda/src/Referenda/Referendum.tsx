// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartOptions, ChartTypeRegistry, TooltipItem } from 'chart.js';
import type { TFunction } from 'react-i18next';
import type { PalletConvictionVotingTally, PalletRankedCollectiveTally, PalletReferendaReferendumInfoConvictionVotingTally, PalletReferendaReferendumInfoRankedCollectiveTally, PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { CurveGraph, ReferendumProps as Props } from '../types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Chart, Columar, ExpandButton, LinkExternal } from '@polkadot/react-components';
import { useBestNumber, useBlockInterval, useToggle } from '@polkadot/react-hooks';
import { calcBlockTime } from '@polkadot/react-hooks/useBlockTime';
import { BN_MILLION, BN_THOUSAND, bnMax, bnToBn, formatNumber, objectSpread } from '@polkadot/util';

import { useTranslation } from '../translate';
import Killed from './RefKilled';
import Ongoing from './RefOngoing';
import Tuple from './RefTuple';

const COMPONENTS: Record<string, React.ComponentType<Props>> = {
  Killed,
  Ongoing
};

const VAL_COLORS = ['#ff8c00', '#9c3333', '#339c33'];
const BOX_COLORS = {
  conf: 'rgba(255, 140, 0, 0.1)',
  enac: 'rgba(0, 0, 140, 0.1)',
  fail: 'rgba(140, 0, 0, 0.02)',
  pass: 'rgba(0, 140, 0, 0.02)',
  past: 'rgba(140, 140, 140, 0.2)'
};
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
  hover: {
    intersect: false
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
  endConfirm: BN | null;
  since: BN;
}

interface ChartProps extends ChartResult {
  colors: string[];
  options: typeof OPTIONS;
}

function createTitleCallback (t: TFunction, bestNumber: BN, blockInterval: BN, extraFn: (blockNumber: BN) => string): (items: TooltipItem<keyof ChartTypeRegistry>[]) => string | string[] {
  return ([{ label }]: TooltipItem<keyof ChartTypeRegistry>[]): string | string[] => {
    try {
      const blockNumber = bnToBn(label.replace(/,/g, ''));
      const extraTitle = extraFn(blockNumber);

      if (blockNumber.gt(bestNumber)) {
        const blocks = blockNumber.sub(bestNumber);
        const when = new Date(Date.now() + blocks.mul(blockInterval).toNumber()).toLocaleString();
        const calc = calcBlockTime(blockInterval, blocks, t);
        const result = [`#${label}`, t('{{when}} (est.)', { replace: { when } }), calc[1]];

        if (extraTitle) {
          result.push(extraTitle);
        }

        return result;
      }

      if (extraTitle) {
        return [`#${label}`, extraTitle];
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
      const { confirming, since } = deciding.unwrap();
      const endConfirm = confirming.unwrapOr(null);
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
        { changeX: appx, currentY: appc, endConfirm, labels, progress: { percent: appc, total: ongoing.tally.ayes.add(ongoing.tally.nays), value: ongoing.tally.ayes }, since, values: values[0] },
        { changeX: supx, currentY: supc, endConfirm, labels, progress: { percent: supc, total: totalEligible, value: currentSupport }, since, values: values[1] }
      ];
    }
  }

  return null;
}

function getChartProps (bestNumber: BN, blockInterval: BN, chartProps: ChartResultExt[], refId: BN, track: PalletReferendaTrackInfo, { x }: CurveGraph, t: TFunction): ChartProps[] {
  const changeXMax = chartProps.reduce((max, { changeX }) =>
    max === -1 || changeX === -1
      ? -1
      : Math.max(max, changeX),
  0);

  return chartProps.map(({ changeX, currentY, endConfirm, labels, progress, since, values }, index): ChartProps => {
    const maxX = labels.length;
    const maxY = index === 0
      ? 100
      : 50;

    const blockToX = (value: BN) =>
      Math.max(0, Math.min(maxX, maxX * (
        value.sub(since).toNumber() / x[x.length - 1].toNumber()
      )));

    const swapX = changeX === -1
      ? -1
      : maxX * (changeX / x.length);
    const enactX = changeXMax !== -1 && bnMax(bestNumber, x[changeXMax].add(since));
    const confirmX = endConfirm
      ? [endConfirm.sub(track.confirmPeriod), endConfirm, endConfirm.add(track.minEnactmentPeriod)]
      : enactX
        ? [enactX, enactX.add(track.confirmPeriod), enactX.add(track.confirmPeriod).add(track.minEnactmentPeriod)]
        : null;
    const title = createTitleCallback(t, bestNumber, blockInterval, (blockNumber) =>
      confirmX && blockNumber.gte(confirmX[0])
        ? blockNumber.lte(confirmX[1])
          ? t('Confirmation period')
          : blockNumber.lte(confirmX[2])
            ? t('Enactment period')
            : ''
        : ''
    );

    return {
      colors: VAL_COLORS,
      labels,
      options: objectSpread({
        plugins: {
          annotation: {
            annotations: objectSpread(
              {
                past: {
                  backgroundColor: BOX_COLORS.past,
                  borderWidth: 0,
                  type: 'box',
                  xMax: blockToX(bestNumber),
                  xMin: 0,
                  yMax: maxY,
                  yMin: 0
                }
              },
              confirmX
                ? {
                  conf: {
                    backgroundColor: BOX_COLORS.conf,
                    borderWidth: 0,
                    type: 'box',
                    xMax: blockToX(confirmX[1]),
                    xMin: blockToX(confirmX[0]),
                    yMax: maxY,
                    yMin: 0
                  },
                  enac: {
                    backgroundColor: BOX_COLORS.enac,
                    borderWidth: 0,
                    type: 'box',
                    xMax: blockToX(confirmX[2]),
                    xMin: blockToX(confirmX[1]),
                    yMax: maxY,
                    yMin: 0
                  }
                }
                : {},
              {
                fail: {
                  backgroundColor: BOX_COLORS.fail,
                  borderWidth: 0,
                  type: 'box',
                  xMax: swapX === -1
                    ? maxX
                    : swapX,
                  xMin: 0,
                  yMax: currentY,
                  yMin: 0
                }
              },
              swapX !== -1
                ? {
                  pass: {
                    backgroundColor: BOX_COLORS.pass,
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
          crosshair: {
            line: {
              color: '#ff8c00',
              dashPattern: [5, 5],
              width: 2
            },
            snapping: {
              enabled: true
            },
            sync: {
              group: refId.toNumber()
            },
            // this would be nice, but atm just doesn't quite
            // seem or feel intuitive...
            zoom: {
              enabled: false
            }
          },
          tooltip: {
            callbacks: {
              title
            },
            intersect: false
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
  const { activeIssuance, className = '', palletReferenda, value: { id, info, isConvictionVote, track, trackGraph } } = props;
  const [isExpanded, toggleExpanded] = useToggle(false);

  const Component = useMemo(
    () => COMPONENTS[info.type] || Tuple,
    [info]
  );

  const chartResult = useMemo(
    () => activeIssuance && trackGraph &&
      getChartResult(activeIssuance, isConvictionVote, info, trackGraph),
    [activeIssuance, info, isConvictionVote, trackGraph]
  );

  const chartProps = useMemo(
    () => bestNumber && chartResult && isExpanded && track && trackGraph &&
      getChartProps(bestNumber, blockInterval, chartResult, id, track, trackGraph, t),
    [bestNumber, blockInterval, chartResult, id, isExpanded, t, track, trackGraph]
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
        <Component {...props} />
        <td className='links media--1000'>
          <LinkExternal
            data={id}
            type={palletReferenda}
          />
        </td>
        <td className='links media--1000'>
          {chartResult && (
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
