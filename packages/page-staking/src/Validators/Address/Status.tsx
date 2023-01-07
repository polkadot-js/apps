// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { Badge, Icon } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import MaxBadge from '../../MaxBadge';

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
            isSmall
          />
        )
        : (
          <Badge
            className='media--1100'
            color='transparent'
            isSmall
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
              isSmall
            />
          )
          : (
            <Badge
              className='media--1100'
              color='transparent'
              isSmall
            />
          )
      )}
      {isChilled
        ? (
          <Badge
            className='media--1000'
            color='red'
            icon='cancel'
            isSmall
          />
        )
        : isElected
          ? (
            <Badge
              className='media--1000'
              color='blue'
              icon='chevron-right'
              isSmall
            />
          )
          : (
            <Badge
              className='media--1000'
              color='transparent'
              isSmall
            />
          )
      }
      {isMain && (
        blockCount || onlineMessage
          ? (
            <Badge
              className='media--900'
              color='green'
              info={blockCount || <Icon icon='envelope' />}
              isSmall
            />
          )
          : (
            <Badge
              className='media--900'
              color='transparent'
              isSmall
            />
          )
      )}
      <MaxBadge
        isSmall
        numNominators={nominators.length}
      />
    </>
  );
}

export default React.memo(Status);
