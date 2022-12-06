// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaReferendumStatusConvictionVotingTally, PalletReferendaReferendumStatusRankedCollectiveTally } from '@polkadot/types/lookup';
import type { BaseReferendumProps as Props, CurveGraph, ReferendumProps } from '../types';

import React, { useMemo } from 'react';

import { Chart, ExpandButton, LinkExternal } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { BN_MILLION, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Killed from './RefKilled';
import Ongoing from './RefOngoing';
import Tuple from './RefTuple';

const COMPONENTS: Record<string, React.ComponentType<ReferendumProps>> = {
  Killed,
  Ongoing
};

const COLORS = ['#8c8c00', '#008c8c'];

const OPTIONS = {
  animation: {
    duration: 0
  },
  aspectRatio: 6,
  maintainAspectRatio: true
};

interface ChartResult {
  colors: string[];
  labels: string[];
  options: typeof OPTIONS;
  values: number[][];
}

function createChart ({ approval, support, x }: CurveGraph, { deciding }: PalletReferendaReferendumStatusConvictionVotingTally | PalletReferendaReferendumStatusRankedCollectiveTally): ChartResult | undefined {
  if (!deciding.isSome) {
    return undefined;
  }

  const labels: string[] = [];
  const values: number[][] = [[], []];
  const { since } = deciding.unwrap();

  for (let i = 0; i < approval.length; i++) {
    labels.push(since.add(x[i]).toString());
    values[0].push(approval[i].div(BN_MILLION).toNumber() / 10);
    values[1].push(support[i].div(BN_MILLION).toNumber() / 10);
  }

  return { colors: COLORS, labels, options: OPTIONS, values };
}

function Referendum (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { className = '', palletReferenda, value: { id, info, trackGraph } } = props;
  const [isExpanded, toggleExpanded] = useToggle(false);

  const Component = useMemo(
    () => COMPONENTS[info.type] || Tuple,
    [info]
  );

  const canExpand = useMemo(
    () => info.isOngoing && info.asOngoing.deciding.isSome,
    [info]
  );

  const chart = useMemo(
    () => canExpand && trackGraph
      ? createChart(trackGraph, info.asOngoing)
      : undefined,
    [canExpand, info, trackGraph]
  );

  const { chartLegend } = useMemo(
    () => ({
      chartLegend: [t<string>('approval'), t<string>('support')]
    }), [t]
  );

  return (
    <>
      <tr className={`${className}${isExpanded ? ' noBorder' : ''}`}>
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
          {canExpand && (
            <ExpandButton
              expanded={isExpanded}
              onClick={toggleExpanded}
            />
          )}
        </td>
      </tr>
      {canExpand && chart && (
        <tr className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'}`}>
          {isExpanded && (
            <td colSpan={10}>
              <Chart.Line
                legends={chartLegend}
                {...chart}
              />
            </td>
          )}
        </tr>
      )}
    </>
  );
}

export default React.memo(Referendum);
