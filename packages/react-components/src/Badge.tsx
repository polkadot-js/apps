// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import styled from 'styled-components';

import Tooltip from './Tooltip';

interface Props {
  className?: string;
  hover?: React.ReactNode;
  info: React.ReactNode;
  isInline?: boolean;
  isTooltip?: boolean;
  type: 'counter' | 'online' | 'offline' | 'next' | 'runnerup' | 'selected';
}

let badgeId = 0;

function Badge ({ className, hover, info, isInline, isTooltip, type }: Props): React.ReactElement<Props> | null {
  const [key] = useState(`${Date.now()}-${badgeId++}`);
  const [isOpen, setIsOpen] = useState(false);

  const _toggleOpen = (): void => setIsOpen(!isOpen);

  return (
    <div
      className={`ui--Badge ${isOpen && 'expand'} ${isInline && 'isInline'} ${isTooltip && 'isTooltip'} ${type} ${className}`}
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
      {hover && (
        <Tooltip
          trigger={`badge-status-${key}`}
          text={hover}
        />
      )}
    </div>
  );
}

export default styled(Badge)`
  border-radius: 16px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
  color: #eee;
  cursor: help;
  font-size: 12px;
  height: 22px;
  padding: 0 4px;
  text-align: center;
  width: 22px;

  &:not(.isInline) {
    display: flex;
    justify-content: center;
    margin-bottom: 0.25rem;
  }

  &.isInline {
    display: inline-block;
    margin-right: 0.25rem;
  }

  &.next {
    background: steelblue;
  }

  &.offline,
  &.counter {
    background: red;
  }

  &.counter {
    margin: 0 0.5rem;
    vertical-align: middle;
  }

  &.runnerup {
    background: brown;
  }

  &.online,
  &.selected {
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
    height: 0;
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
