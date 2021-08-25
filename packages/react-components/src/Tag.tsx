// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';

import { ThemeDef } from '@polkadot/react-components/types';

import Tooltip from './Tooltip';

interface Props {
  className?: string;
  color?: 'blue' | 'green' | 'grey' | 'orange' | 'pink' | 'red' | 'yellow' | 'theme';
  hover?: React.ReactNode;
  isFlag?: boolean;
  label: React.ReactNode;
  size?: 'small' | 'tiny';
}

let tagId = 0;

function Tag ({ className = '', color = 'theme', hover, isFlag, label, size = 'small' }: Props): React.ReactElement<Props> {
  const { theme } = useContext<ThemeDef>(ThemeContext);
  const [trigger] = useState(() => `tag-hover-${Date.now()}-${tagId++}`);
  const tooltipProps = hover
    ? { 'data-for': trigger, 'data-tip': true }
    : {};

  return (
    <div
      className={`ui--Tag ${color}Color ${size}Size ${theme}Theme ${isFlag ? ' isFlag' : ''} ${className}`}
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
  font-size: 0.857rem;
  font-weight: var(--font-weight-normal);
  line-height: 1.143rem;
  margin: 0 0.125rem;
  padding: 0.571em 0.857em;
  position: relative;
  white-space: nowrap;
  z-index: 1;

  &.darkTheme {
    &:after {
      background-color: var(--bg-tabs) !important;
    }
  }

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

  &:not(.isFlag).themeColor.darkTheme {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }

  &.isFlag {
    border-radius: 0 0.25rem 0.25rem 0;
    padding: 0.5833em 1.25em 0.5833em 1.5em;
    font-size: 0.78571429rem;
    line-height: 1;

    &.themeColor.darkTheme,
    &.themeColor.lightTheme {
      color: #fff;
    }

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
      border-radius: 0.2rem 0 0.1rem 0;
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
