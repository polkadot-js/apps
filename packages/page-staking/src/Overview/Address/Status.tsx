// Copyright 2017-2022 @polkadot/app-staking authors & contributors
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
            color='green'
            icon='hand-paper'
          />
        )
        : <Badge color='transparent' />
      }
      {isRelay && (
        isPara
          ? (
            <Badge
              color='purple'
              icon='vector-square'
            />
          )
          : <Badge color='transparent' />
      )}
      {isChilled
        ? (
          <Badge
            color='red'
            icon='cancel'
          />
        )
        : isElected
          ? (
            <Badge
              color='blue'
              icon='chevron-right'
            />
          )
          : <Badge color='transparent' />
      }
      {isMain && (
        blockCount || onlineMessage
          ? (
            <Badge
              color='green'
              info={blockCount || <Icon icon='envelope' />}
            />
          )
          : <Badge color='transparent' />
      )}
      <MaxBadge numNominators={nominators.length} />
    </>
  );
}

export default React.memo(Status);
