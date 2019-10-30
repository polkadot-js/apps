// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import styled from 'styled-components';

import Tooltip from './Tooltip';

interface Props {
  className?: string;
  hover: React.ReactNode;
  info: React.ReactNode;
  isTooltip?: boolean;
  type: 'online' | 'offline' | 'next';
}

let badgeId = 0;

function Badge ({ className, hover, info, isTooltip, type }: Props): React.ReactElement<Props> | null {
  const [key] = useState(`${Date.now()}-${badgeId++}`);
  const [isOpen, setIsOpen] = useState(false);

  const _toggleOpen = (): void => setIsOpen(!isOpen);

  return (
    <div
      className={`ui--Badge ${isOpen && 'expand'} ${isTooltip && 'tooltip'} ${type} ${className}`}
      onClick={
        isTooltip
          ? _toggleOpen
          : undefined
      }
      data-for={`badge-status-${key}`}
      data-tip={true}
      data-tip-disable={!isTooltip}
    >
      <div className='badge'>
        {info}
      </div>
      <div className='detail'>
        {hover}
      </div>
      <Tooltip
        trigger={`badge-status-${key}`}
        text={hover}
      />
    </div>
  );
}

export default styled(Badge)`
  border-radius: 16px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
  color: #eee;
  cursor: help;
  display: flex;
  font-size: 12px;
  height: 22px;
  justify-content: center;
  margin-bottom: 0.25rem;
  padding: 0 4px;
  text-align: center;
  width: 22px;

  &.next {
    background: steelblue;
  }

  &.offline {
    background: red;
  }

  &.online {
    background: green;
  }

  & > * {
    line-height: 22px;
    overflow: hidden;
    transition: all ease 0.25;
  }

  .badge {
    font-weight: bold;
    width: auto;
  }

  .detail {
    width: 0;
  }

  &.expand {
    width: 300px;

    .badge {
      width: 0;
    }

    .detail {
      width: auto;
    }
  }
`;
