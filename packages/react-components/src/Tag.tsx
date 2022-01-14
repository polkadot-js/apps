// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';

import { FlagColor as TagColor, ThemeDef } from '@polkadot/react-components/types';

import Tooltip from './Tooltip';

interface Props {
  className?: string;
  color?: TagColor;
  hover?: React.ReactNode;
  label: React.ReactNode;
  size?: 'small' | 'tiny';
}

let tagId = 0;

function Tag ({ className = '', color = 'theme', hover, label, size = 'small' }: Props): React.ReactElement<Props> {
  const { theme } = useContext(ThemeContext as React.Context<ThemeDef>);
  const [trigger] = useState(() => `tag-hover-${Date.now()}-${tagId++}`);
  const tooltipProps = hover
    ? { 'data-for': trigger, 'data-tip': true }
    : {};

  return (
    <div
      className={`ui--Tag ${color}Color ${size}Size ${theme}Theme ${className}`}
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

  &.themeColor.darkTheme {
    background-color: rgba(255,255,255,0.08);
  }
`);
