// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletConvictionVotingTally, PalletRankedCollectiveTally, PalletReferendaReferendumInfoConvictionVotingTally, PalletReferendaReferendumInfoRankedCollectiveTally } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { BaseReferendumProps as Props, CurveGraph, ReferendumProps } from '../types';

import React, { useMemo } from 'react';

import { Chart, Columar, ExpandButton, LinkExternal } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { BN_MILLION, BN_THOUSAND, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Killed from './RefKilled';
import Ongoing from './RefOngoing';
import Tuple from './RefTuple';

const COMPONENTS: Record<string, React.ComponentType<ReferendumProps>> = {
  Killed,
  Ongoing
};

const COLORS = [['#8c8c00', '#8c8c8c'], ['#008c8c', '#8c8c8c']];

const OPTIONS = {
  animation: {
    duration: 0
  },
  aspectRatio: 2.5,
  maintainAspectRatio: true
};

interface ChartResult {
  colors: string[];
  labels: string[];
  options: typeof OPTIONS;
  values: number[][];
}

function getChartProps (totalEligible: BN, isConvictionVote: boolean, info: PalletReferendaReferendumInfoConvictionVotingTally | PalletReferendaReferendumInfoRankedCollectiveTally, trackGraph: CurveGraph): ChartResult[] | null {
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
      const values: number[][][] = [[[], []], [[], []]];

      for (let i = 0; i < approval.length; i++) {
        labels.push(formatNumber(since.add(x[i])));
        values[0][0].push(approval[i].div(BN_MILLION).toNumber() / 10);
        values[0][1].push(tally.ayes.isZero() ? 0 : tally.ayes.mul(BN_THOUSAND).div(tally.ayes.add(tally.nays)).toNumber() / 10);

        values[1][0].push(support[i].div(BN_MILLION).toNumber() / 10);
        values[1][1].push(currentSupport.mul(BN_THOUSAND).div(totalEligible).toNumber() / 10);
      }

      return [
        { colors: COLORS[0], labels, options: OPTIONS, values: values[0] },
        { colors: COLORS[1], labels, options: OPTIONS, values: values[1] }
      ];
    }
  }

  return null;
}

function Referendum (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { className = '', eligibleIssuance, palletReferenda, value: { id, info, isConvictionVote, trackGraph } } = props;
  const [isExpanded, toggleExpanded] = useToggle(false);

  const Component = useMemo(
    () => COMPONENTS[info.type] || Tuple,
    [info]
  );

  const chartProps = useMemo(
    () => eligibleIssuance && trackGraph && getChartProps(eligibleIssuance, isConvictionVote, info, trackGraph),
    [eligibleIssuance, info, isConvictionVote, trackGraph]
  );

  const chartLegend = useMemo(
    () => [
      [
        t<string>('minimum approval'),
        t<string>('current approval')
      ],
      [
        t<string>('minimum support'),
        t<string>('current support')
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
      {chartProps && (
        <tr className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'}`}>
          {isExpanded && (
            <td colSpan={10}>
              <Columar>
                <Columar.Column>
                  <Chart.Line
                    legends={chartLegend[0]}
                    {...chartProps[0]}
                  />
                </Columar.Column>
                <Columar.Column>
                  <Chart.Line
                    legends={chartLegend[1]}
                    {...chartProps[1]}
                  />
                </Columar.Column>
              </Columar>
            </td>
          )}
        </tr>
      )}
    </>
  );
}

export default React.memo(Referendum);
