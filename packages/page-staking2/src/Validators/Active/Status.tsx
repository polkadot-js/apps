// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Validator } from '../../types';
import type { UseHeartbeat } from '../types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Badge } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  heartbeat?: UseHeartbeat;
  isChilled?: boolean;
  nominators?: string[];
  validator: Validator;
}

function Status ({ className, heartbeat: { authoredBlocks, isOnline } = {}, isChilled, nominators, validator: { isElected, isPara } }: Props): React.ReactElement<Props> {
  const { allAccounts } = useAccounts();

  const isNominating = useMemo(
    () => nominators && nominators.some((a) => allAccounts.includes(a)),
    [allAccounts, nominators]
  );

  const emptyBadge = (
    <Badge
      className='opaque'
      color='gray'
    />
  );

  return (
    <StyledDiv className={className}>
      {isNominating
        ? (
          <Badge
            color='green'
            icon='hand-paper'
          />
        )
        : emptyBadge
      }
      {isPara
        ? (
          <Badge
            color='purple'
            icon='vector-square'
          />
        )
        : emptyBadge
      }
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
          : emptyBadge
      }
      {isOnline
        ? authoredBlocks
          ? (
            <Badge
              color='green'
              info={
                <span className='authoredBlocks'>{authoredBlocks}</span>
              }
            />
          )
          : (
            <Badge
              color='green'
              icon='envelope'
            />
          )
        : emptyBadge
      }
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .authoredBlocks {
    vertical-align: top;
    font-size: var(--font-percent-tiny);
  }
`;

export default React.memo(Status);
