// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { Badge } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import MaxBadge from '../../MaxBadge.js';

interface Props {
  isChilled?: boolean;
  isElected: boolean;
  isMain?: boolean;
  isPara?: boolean;
  isRelay?: boolean;
  nominators?: { nominatorId: string }[];
  onlineCount?: false | BN;
  onlineMessage?: boolean;
}

const NO_NOMS: { nominatorId: string }[] = [];

function Status ({ isChilled, isElected, isMain, isPara, isRelay, nominators = NO_NOMS, onlineCount, onlineMessage }: Props): React.ReactElement<Props> {
  const { allAccounts } = useAccounts();
  const blockCount = onlineCount && onlineCount.toNumber();

  const isNominating = useMemo(
    () => nominators.some(({ nominatorId }) => allAccounts.includes(nominatorId)),
    [allAccounts, nominators]
  );

  return (
    <>
      {isNominating
        ? (
          <Badge
            className='media--1100'
            color='green'
            icon='hand-paper'
          />
        )
        : (
          <Badge
            className='media--1100'
            color='transparent'
          />
        )
      }
      {isRelay && (
        isPara
          ? (
            <Badge
              className='media--1100'
              color='purple'
              icon='vector-square'
            />
          )
          : (
            <Badge
              className='media--1100'
              color='transparent'
            />
          )
      )}
      {isChilled
        ? (
          <Badge
            className='media--1000'
            color='red'
            icon='cancel'
          />
        )
        : isElected
          ? (
            <Badge
              className='media--1000'
              color='blue'
              icon='chevron-right'
            />
          )
          : (
            <Badge
              className='media--1000'
              color='transparent'
            />
          )
      }
      {isMain && (
        blockCount
          ? (
            <Badge
              className='media--900'
              color='green'
              info={blockCount}
            />
          )
          : onlineMessage
            ? (
              <Badge
                className='media--900'
                color='green'
                icon='envelope'
              />
            )
            : (
              <Badge
                className='media--900'
                color='transparent'
              />
            )
      )}
      <MaxBadge numNominators={nominators.length} />
    </>
  );
}

export default React.memo(Status);
