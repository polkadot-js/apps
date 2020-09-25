// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveDemocracyLock } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import { TFunction } from 'i18next';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN_ZERO, bnMax, formatBalance, formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';
import Icon from './Icon';
import Tooltip from './Tooltip';

interface Props {
  className?: string;
  value?: DeriveDemocracyLock[];
}

interface Entry {
  details: React.ReactNode;
  headers: React.ReactNode[];
  isCountdown: boolean;
  isFinished: boolean;
}

interface State {
  maxBalance: BN;
  sorted: Entry[];
}

let id = 0;

// group by header & details
//   - all unlockable together
//   - all ongoing together
//   - unlocks are displayed individually
function groupLocks (t: TFunction, bestNumber: BN, locks: DeriveDemocracyLock[] = []): State {
  return {
    maxBalance: bnMax(...locks.map(({ balance }) => balance)),
    sorted: locks
      .map((info): [DeriveDemocracyLock, BN] => [info, info.unlockAt.gt(bestNumber) ? info.unlockAt.sub(bestNumber) : BN_ZERO])
      .sort((a, b) => a[0].referendumId.cmp(b[0].referendumId))
      .sort((a, b) => a[1].cmp(b[1]))
      .sort((a, b) => a[0].isFinished === b[0].isFinished ? 0 : (a[0].isFinished ? -1 : 1))
      .reduce((sorted: Entry[], [{ balance, isDelegated, isFinished, referendumId, vote }, blocks]): Entry[] => {
        const isCountdown = blocks.gt(BN_ZERO);
        const header = <div>#{referendumId.toString()} {formatBalance(balance, { forceUnit: '-' })} {vote.conviction.toString()}{isDelegated && '/d'}</div>;
        const prev = sorted.length ? sorted[sorted.length - 1] : null;

        if (!prev || (isCountdown || (isFinished !== prev.isFinished))) {
          sorted.push({
            details: (
              <div className='faded'>
                {isCountdown
                  ? (
                    <BlockToTime
                      blocks={blocks}
                      label={`${t<string>('{{blocks}} blocks', { replace: { blocks: formatNumber(blocks) } })}, `}
                    />
                  )
                  : isFinished
                    ? t<string>('lock expired')
                    : t<string>('ongoing referendum')
                }
              </div>
            ),
            headers: [header],
            isCountdown,
            isFinished
          });
        } else {
          prev.headers.push(header);
        }

        return sorted;
      }, [])
  };
}

function DemocracyLocks ({ className = '', value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  const [trigger] = useState(`${Date.now()}-democracy-locks-${++id}`);
  const [{ maxBalance, sorted }, setState] = useState<State>({ maxBalance: BN_ZERO, sorted: [] });

  useEffect((): void => {
    bestNumber && setState((state): State => {
      const newState = groupLocks(t, bestNumber, value);

      // only update when the structure of new is different
      //   - it has a new overall breakdown with sections
      //   - one of the sections has a different number of headers
      return state.sorted.length !== newState.sorted.length || state.sorted.some((s, i) => s.headers.length !== newState.sorted[i].headers.length)
        ? newState
        : state;
    });
  }, [bestNumber, t, value]);

  if (!sorted.length) {
    return null;
  }

  return (
    <div className={className}>
      <Icon
        icon='clock'
        tooltip={trigger}
      />
      <FormatBalance value={maxBalance} />
      <Tooltip
        text={sorted.map(({ details, headers }, index): React.ReactNode => (
          <div
            className='row'
            key={index}
          >
            {headers.map((header, index) => (
              <div key={index}>{header}</div>
            ))}
            <div className='faded'>{details}</div>
          </div>
        ))}
        trigger={trigger}
      />
    </div>
  );
}

export default React.memo(styled(DemocracyLocks)`
  white-space: nowrap;

  .ui--Icon {
    margin-left: 0;
    margin-right: 0.25rem;
  }

  .ui--FormatBalance {
    display: inline-block;
  }
`);
