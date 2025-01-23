// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FlagColor } from './types.js';

import React from 'react';

import { styled } from './styled.js';
import Tag from './Tag.js';

interface FlagProps {
  className?: string;
  color: FlagColor;
  label: React.ReactNode;
}

function Flag ({ className = '', color, label }: FlagProps): React.ReactElement<FlagProps> {
  return (
    <StyledTag
      className={`${className} ${color === 'theme' ? ' highlight--color-bg highlight--bg' : ''}` }
      color={color}
      label={label}
      size='tiny'
    />
  );
}

const StyledTag = styled(Tag)`
  border-radius: 0 0.25rem 0.25rem 0;
  padding: 0.5833em 1.25em 0.5833em 1.5em;
  font-size: var(--font-size-tiny);
  line-height: 1;
  color: #fff !important;

  &.darkTheme {
    :after {
      background-color: var(--bg-tabs);
    }
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
    width: 1.5em;
    height: 1.5em;
    position: absolute;
    transform: translateY(-50%) translateX(50%) rotate(-45deg);
    top: 50%;
    transition: none;
  }
`;

export default React.memo(Flag);
