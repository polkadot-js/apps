// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import styled from 'styled-components';

import Tooltip from './Tooltip';

interface Props {
  className?: string;
  color?: 'blue' | 'green' | 'grey' | 'orange' | 'pink' | 'red' | 'yellow';
  hover?: React.ReactNode;
  isTag?: boolean;
  label: React.ReactNode;
  size?: 'small' | 'tiny';
}

let tagId = 0;

function Tag ({ className = '', color = 'grey', hover, isTag = true, label, size = 'small' }: Props): React.ReactElement<Props> {
  const [trigger] = useState(`tag-hover-${Date.now()}-${tagId++}`);
  const tooltipProps = hover
    ? { 'data-for': trigger, 'data-tip': true }
    : {};

  return (
    <div
      className={`${color}Color${isTag ? ' isTag' : ''} ${size}Size ${className}`}
      color={color || 'grey'}
      {...tooltipProps}
    >
      {label}
      {hover && (
        <Tooltip
          text={hover}
          trigger={trigger}
        />
      )}
    </div>
  );
}

export default React.memo(styled(Tag)`
  border-radius: 0.25rem;
  color: #fff;
  display: inline-block;
  font-size: 0.78571429rem;
  font-weight: normal;
  line-height: 1;
  margin: 0.125rem;
  padding: 0.5833em 0.833em;
  position: relative;
  white-space: nowrap;
  z-index: 1;

  &.tinySize {
    font-size: .71428571rem;
  }

  &.blueColor {
    background: #2185d0;
  }

  &.greenColor {
    background: #21ba45;
  }

  &.greyColor {
    background: #767676;
  }

  &.orangeColor {
    background: #f2711c;
  }

  &.pinkColor {
    background: #e03997;
  }

  &.redColor {
    background: #db2828;
  }

  &.yellowColor {
    background: darkgoldenrod;
  }

  &.isTag {
    border-radius: 0 0.25rem 0.25rem 0;
    padding-left: 1.5em;
    padding-right: 1.25em;

    &:after {
      background-color: #fff;
      border-radius: 500rem;
      content: '';
      left: -0.25em;
      margin-top: -0.25em;
      position: absolute;
      width: 0.5em;
      height: 0.5em;
      top: 50%;
    }

    &:before {
      background-color: inherit;
      background-image: none;
      content: '';
      right: 100%;
      width: 1.56em;
      height: 1.56em;
      position: absolute;
      transform: translateY(-50%) translateX(50%) rotate(-45deg);
      top: 50%;
      transition: none;
    }
  }
`);
