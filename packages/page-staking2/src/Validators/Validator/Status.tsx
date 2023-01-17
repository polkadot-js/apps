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
      {isOnline
        ? authoredBlocks
          ? (
            <Badge
              className='media--900'
              color='green'
              info={authoredBlocks}
            />
          )
          : (
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
      }
    </div>
  );
}

export default React.memo(Status);
