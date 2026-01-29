// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FlagColor as TagColor } from './types.js';

import React, { useState } from 'react';

import { useTheme } from '@polkadot/react-hooks';

import { styled } from './styled.js';
import Tooltip from './Tooltip.js';

interface Props {
  className?: string;
  color?: TagColor;
  hover?: React.ReactNode;
  label: React.ReactNode;
  size?: 'small' | 'tiny';
}

let tagId = 0;

function Tag ({ className = '', color = 'theme', hover, label, size = 'small' }: Props): React.ReactElement<Props> {
  const { theme } = useTheme();
  const [trigger] = useState(() => `tag-hover-${Date.now()}-${tagId++}`);

  return (
    <StyledDiv
      className={`${className} ui--Tag ${color}Color ${size}Size ${theme}Theme`}
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
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  border-radius: 0.25rem;
  color: #fff;
  display: inline-block;
  font-size: var(--font-size-tiny);
  font-weight: var(--font-weight-normal);
  line-height: 1rem;
  margin: 0 0.125rem;
  opacity: 0.85;
  padding: 0.25em 0.75em;
  position: relative;
  white-space: nowrap;
  z-index: 1;

  &.tinySize {
    font-size: var(--font-size-tiny);
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

  &.lightgreyColor {
    background: #b6b6b6;
    opacity: 0.7;
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
`;

export default React.memo(Tag);
