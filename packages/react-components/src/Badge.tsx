// Copyright 2017-2020 @polkadot/app-staking authors & contributors
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
  isSmall?: boolean;
  isTooltip?: boolean;
  onClick?: () => void;
  type: 'counter' | 'online' | 'offline' | 'next' | 'runnerup' | 'selected' | 'green' | 'blue' | 'brown' | 'gray';
}

let badgeId = 0;

function Badge ({ className, hover, info, isInline, isSmall, isTooltip, onClick, type }: Props): React.ReactElement<Props> | null {
  const [key] = useState(`${Date.now()}-${badgeId++}`);

  return (
    <div
      className={`ui--Badge ${isInline && 'isInline'} ${isTooltip && 'isTooltip'} ${isSmall && 'isSmall'} ${onClick && 'isClickable'} ${type} ${className}`}
      data-for={`badge-status-${key}`}
      data-tip={true}
      data-tip-disable={!isTooltip}
      onClick={onClick}
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

  i.icon {
    cursor: inherit !important;
    margin: 0;
    width: 1em;
  }

  &.isClickable {
    cursor: pointer;
  }

  &.isSmall {
    box-shadow: none;
    font-size: 10px;
    height: 16px;
    line-height: 16px;
    padding: 0;
    width: 16px;
  }

  &:not(.isInline) {
    display: flex;
    justify-content: center;
    margin-bottom: 0.25rem;
  }

  &.isInline {
    display: inline-block;
    margin-right: 0.25rem;
  }

  &.next,
  &.blue {
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

  &.gray {
    background: #eee;
    color: #aaa;
  }

  &.runnerup,
  &.brown {
    background: brown;
  }

  &.online,
  &.selected,
  &.green {
    background: green;
  }

  & > * {
    line-height: 22px;
    overflow: hidden;
  }

  &.isSmall > * {
    line-height: 16px;
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
