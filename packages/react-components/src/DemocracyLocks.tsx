// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { DeriveDemocracyLock } from '@polkadot/api-derive/types';
import type { Balance } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useBestNumber } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN_ZERO, bnMax, formatBalance, formatNumber } from '@polkadot/util';

import Icon from './Icon';
import Tooltip from './Tooltip';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  value?: Partial<DeriveDemocracyLock>[];
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
function groupLocks (t: TFunction, bestNumber: BN, locks: Partial<DeriveDemocracyLock>[] = []): State {
  return {
    maxBalance: bnMax(...locks.map(({ balance }) => balance).filter((b): b is Balance => !!b)),
    sorted: locks
      .map((info): [Partial<DeriveDemocracyLock>, BN] => [info, info.unlockAt && info.unlockAt.gt(bestNumber) ? info.unlockAt.sub(bestNumber) : BN_ZERO])
      .sort((a, b) => (a[0].referendumId || BN_ZERO).cmp(b[0].referendumId || BN_ZERO))
      .sort((a, b) => a[1].cmp(b[1]))
      .sort((a, b) => a[0].isFinished === b[0].isFinished ? 0 : (a[0].isFinished ? -1 : 1))
      .reduce((sorted: Entry[], [{ balance, isDelegated, isFinished = false, referendumId, vote }, blocks]): Entry[] => {
        const isCountdown = blocks.gt(BN_ZERO);
        const header = referendumId && vote
          ? <div>#{referendumId.toString()} {formatBalance(balance, { forceUnit: '-' })} {vote.conviction.toString()}{isDelegated && '/d'}</div>
          : <div>{t('Prior locked voting')}</div>;
        const prev = sorted.length ? sorted[sorted.length - 1] : null;

        if (!prev || (isCountdown || (isFinished !== prev.isFinished))) {
          sorted.push({
            details: (
              <div className='faded'>
                {isCountdown
                  ? (
                    <BlockToTime
                      label={`${t<string>('{{blocks}} blocks', { replace: { blocks: formatNumber(blocks) } })}, `}
                      value={blocks}
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
  const bestNumber = useBestNumber();
  const [trigger] = useState(() => `${Date.now()}-democracy-locks-${++id}`);
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
      <FormatBalance
        labelPost={
          <Icon
            icon='clock'
            tooltip={trigger}
          />
        }
        value={maxBalance}
      />
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

  .ui--FormatBalance {
    display: inline-block;
  }
`);
