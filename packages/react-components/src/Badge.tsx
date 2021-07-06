// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import React, { useState } from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import Tooltip from './Tooltip';

interface Props {
  className?: string;
  color: 'blue' | 'gray' | 'green' | 'highlight' | 'normal' | 'orange' | 'purple' | 'red' | 'transparent' | 'white';
  hover?: React.ReactNode;
  icon?: IconName;
  info?: React.ReactNode;
  isSmall?: boolean;
  onClick?: () => void;
}

let badgeId = 0;

function Badge ({ className = '', color = 'normal', hover, icon, info, isSmall, onClick }: Props): React.ReactElement<Props> | null {
  const [trigger] = useState(() => `badge-hover-${Date.now()}-${badgeId++}`);
  const extraProps = hover
    ? { 'data-for': trigger, 'data-tip': true }
    : {};
  const isHighlight = color === 'highlight';

  return (
    <div
      {...extraProps}
      className={`ui--Badge${hover ? ' isTooltip' : ''}${isSmall ? ' isSmall' : ''}${onClick ? ' isClickable' : ''}${isHighlight ? ' highlight--bg' : ''} ${color}Color ${className}`}
      onClick={onClick}
    >
      <div className={isHighlight ? 'highlight--color-contrast' : ''}>{info || (icon && <Icon icon={icon} />)}</div>
      {hover && (
        <Tooltip
          text={hover}
          trigger={trigger}
        />
      )}
    </div>
  );
}

export default React.memo(styled(Badge)`
  border-radius: 16px;
  box-sizing: border-box;
  color: #eeedec;
  display: inline-block;
  font-size: 12px;
  height: 22px;
  line-height: 22px;
  margin-right: 0.25rem;
  min-width: 22px;
  padding: 0 4px;
  overflow: hidden;
  text-align: center;
  vertical-align: middle;
  width: 22px;

  &.isTooltip {
    cursor: help;
  }

  .ui--Icon {
    cursor: inherit;
    margin-top: 5px;
    vertical-align: top;
    width: 1em;
  }

  &.isClickable {
    cursor: pointer;
  }

  &.isSmall {
    font-size: 10px;
    height: 16px;
    line-height: 16px;
    min-width: 16px;
    padding: 0;
    width: 16px;

    .ui--Icon {
      margin-top: 3px;
    }
  }

  &.blueColor {
    background: steelblue;
  }

  &.counterColor {
    margin: 0 0.5rem;
    vertical-align: middle;
  }

  &.grayColor {
    background: #eeedec !important;
    color: #aaa9a8;
  }

  &.redColor {
    background: darkred;
  }

  &.greenColor {
    background: green;
  }

  &.orangeColor {
    background: darkorange;
  }

  &.purpleColor {
    background: indigo;
  }

  &.transparentColor {
    background: transparent;
    box-shadow: none;
  }

  &.whiteColor {
    background: rgba(255, 255, 255, 0.3);
  }
`);
