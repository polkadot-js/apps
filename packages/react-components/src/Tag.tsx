// Copyright 2017-2023 @polkadot/react-components authors & contributors
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

  return (
    <div
      className={`ui--Tag ${color}Color ${size}Size ${theme}Theme ${className}`}
      color={color || 'grey'}
      data-for={hover && trigger}
      data-tip={!!hover}
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
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-normal);
  line-height: 1.143rem;
  margin: 0 0.125rem;
  opacity: 0.85;
  padding: 0.25em 0.75em;
  position: relative;
  white-space: nowrap;
  z-index: 1;

  &.tinySize {
    font-size: .71428571rem;
  }

  &.blackColor {
    background: #000;
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

  &.purpleColor {
    background: #a45ee5;
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
