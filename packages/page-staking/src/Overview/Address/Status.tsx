// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useMemo } from 'react';
import { Badge, Icon } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import MaxBadge from '../../MaxBadge';

interface Props {
  isElected: boolean;
  isMain?: boolean;
  nominators?: ([string, BN] | [string, BN, number])[];
  onlineCount?: false | BN;
  onlineMessage?: boolean;
}

function Status ({ isElected, isMain, nominators = [], onlineCount, onlineMessage }: Props): React.ReactElement<Props> {
  const { allAccounts } = useAccounts();
  const blockCount = onlineCount && onlineCount.toNumber();

  const isNominating = useMemo(
    () => nominators.some(([nominatorId]) => allAccounts.includes(nominatorId)),
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
      {isElected
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
