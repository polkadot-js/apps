// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletConvictionVotingTally, PalletRankedCollectiveTally, PalletReferendaReferendumInfoConvictionVotingTally, PalletReferendaReferendumInfoRankedCollectiveTally } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { BaseReferendumProps as Props, CurveGraph, ReferendumProps } from '../types';

import React, { useMemo } from 'react';

import { Chart, Columar, ExpandButton, LinkExternal } from '@polkadot/react-components';
import { useBestNumber, useToggle } from '@polkadot/react-hooks';
import { BN_MILLION, BN_THOUSAND, formatNumber, objectSpread } from '@polkadot/util';

import { useTranslation } from '../translate';
import Killed from './RefKilled';
import Ongoing from './RefOngoing';
import Tuple from './RefTuple';

const COMPONENTS: Record<string, React.ComponentType<ReferendumProps>> = {
  Killed,
  Ongoing
};

const COLORS = ['#8c8c8c', '#9c3333', '#339c33'];
const PT_CUR = 0;
const PT_NEG = 1;
const PT_POS = 2;

const OPTIONS = {
  animation: {
    duration: 0
  },
  aspectRatio: 2.5,
  maintainAspectRatio: true,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

interface ChartResult {
  colors: string[];
  labels: string[];
  options: typeof OPTIONS;
  values: number[][];
}

interface ChartResultExt extends ChartResult {
  since: BN;
  trackGraph: CurveGraph;
}

function getChartProps (totalEligible: BN, isConvictionVote: boolean, info: PalletReferendaReferendumInfoConvictionVotingTally | PalletReferendaReferendumInfoRankedCollectiveTally, trackGraph: CurveGraph): ChartResultExt[] | null {
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

      for (let i = 0; i < approval.length; i++) {
        labels.push(formatNumber(since.add(x[i])));

        const appr = approval[i].div(BN_MILLION).toNumber() / 10;
        const appc = tally.ayes.isZero() ? 0 : tally.ayes.mul(BN_THOUSAND).div(tally.ayes.add(tally.nays)).toNumber() / 10;

        values[0][PT_CUR][i] = appr;
        values[0][appc < appr ? PT_NEG : PT_POS][i] = appc;

        const supr = support[i].div(BN_MILLION).toNumber() / 10;
        const supc = totalEligible.isZero() ? 0 : currentSupport.mul(BN_THOUSAND).div(totalEligible).toNumber() / 10;

        values[1][PT_CUR][i] = supr;
        values[1][supc < supr ? PT_NEG : PT_POS][i] = supc;
      }

      return [
        { colors: COLORS, labels, options: OPTIONS, since, trackGraph, values: values[0] },
        { colors: COLORS, labels, options: OPTIONS, since, trackGraph, values: values[1] }
      ];
    }
  }

  return null;
}

function annotateChart (bestNumber: BN, chartProps: ChartResultExt[]): ChartResult[] {
  return chartProps.map(({ colors, labels, options, since, trackGraph: { x }, values }, index): ChartResult => ({
    colors,
    labels,
    options: objectSpread({
      plugins: {
        annotation: {
          annotations: {
            box1: {
              backgroundColor: 'rgba(140, 140, 140, 0.25)',
              type: 'box',
              xMax: 100 * (
                bestNumber.sub(since.add(x[0])).toNumber() / x[x.length - 1].sub(x[0]).toNumber()
              ),
              xMin: 0,
              yMax: index === 0
                ? 100
                : 50,
              yMin: 0
            }
          }
        }
      }
    }, options),
    values
  }));
}

function Referendum (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const bestNumber = useBestNumber();
  const { activeIssuance, className = '', palletReferenda, value: { id, info, isConvictionVote, trackGraph } } = props;
  const [isExpanded, toggleExpanded] = useToggle(false);

  const Component = useMemo(
    () => COMPONENTS[info.type] || Tuple,
    [info]
  );

  const chartProps = useMemo(
    () => activeIssuance && trackGraph && getChartProps(activeIssuance, isConvictionVote, info, trackGraph),
    [activeIssuance, info, isConvictionVote, trackGraph]
  );

  const annotatedChartProps = useMemo(
    () => bestNumber && chartProps && annotateChart(bestNumber, chartProps),
    [bestNumber, chartProps]
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
      <tr className={`${className} ${annotatedChartProps && isExpanded ? 'isExpanded' : 'isCollapsed'}`}>
        {annotatedChartProps && isExpanded && (
          <td colSpan={10}>
            <Columar>
              <Columar.Column>
                <Chart.Line
                  legends={chartLegend[0]}
                  {...annotatedChartProps[0]}
                />
              </Columar.Column>
              <Columar.Column>
                <Chart.Line
                  legends={chartLegend[1]}
                  {...annotatedChartProps[1]}
                />
              </Columar.Column>
            </Columar>
          </td>
        )}
      </tr>
    </>
  );
}

export default React.memo(Referendum);
