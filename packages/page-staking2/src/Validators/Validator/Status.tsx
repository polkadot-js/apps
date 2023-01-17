// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Validator } from '../../types';
import type { Heartbeat } from './types';

import React, { useMemo } from 'react';

import { Badge } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  heartbeat: Heartbeat;
  isChilled?: boolean;
  isPara?: boolean;
  isRelay?: boolean;
  nominators?: string[];
  validator: Validator;
}

function Status ({ className = '', heartbeat: { authoredBlocks, isOnline }, isChilled, isPara, isRelay, nominators, validator: { isElected } }: Props): React.ReactElement<Props> {
  const { allAccounts } = useAccounts();

  const isNominating = useMemo(
    () => nominators && nominators.some((a) => allAccounts.includes(a)),
    [allAccounts, nominators]
  );

  return (
    <div className={className}>
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
      {isOnline
        ? authoredBlocks
          ? (
            <Badge
              color='green'
              info={authoredBlocks}
            />
          )
          : (
            <Badge
              color='green'
              icon='envelope'
            />
          )
        : <Badge color='transparent' />
      }
    </div>
  );
}

export default React.memo(Status);
