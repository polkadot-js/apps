// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IconName } from '@fortawesome/fontawesome-svg-core';

import React, { useState } from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import Tooltip from './Tooltip';

interface Props {
  className?: string;
  color: 'counter' | 'green' | 'blue' | 'gray' | 'normal' | 'purple' | 'red' | 'transparent';
  hover?: React.ReactNode;
  icon?: IconName;
  info?: React.ReactNode;
  isSmall?: boolean;
  onClick?: () => void;
}

let badgeId = 0;

function Badge ({ className = '', color = 'normal', hover, icon, info, isSmall, onClick }: Props): React.ReactElement<Props> | null {
  const [trigger] = useState(`badge-hover-${Date.now()}-${badgeId++}`);
  const extraProps = hover
    ? { 'data-for': trigger, 'data-tip': true }
    : {};

  return (
    <div
      {...extraProps}
      className={`ui--Badge${hover ? ' isTooltip' : ''}${isSmall ? ' isSmall' : ''}${onClick ? ' isClickable' : ''} ${color}Color ${className}`}
      onClick={onClick}
    >
      {info || (icon && <Icon icon={icon} />)}
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
  color: #eee;
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
    background: red;
    margin: 0 0.5rem;
    vertical-align: middle;
  }

  &.grayColor {
    background: #eee !important;
    color: #aaa;
  }

  &.redColor {
    background: darkred;
  }

  &.greenColor {
    background: green;
  }

  &.purpleColor {
    background: indigo;
  }

  &.transparentColor {
    background: transparent;
    box-shadow: none;
  }
`);
