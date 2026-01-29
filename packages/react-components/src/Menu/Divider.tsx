// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DividerProps } from './types.js';

import React from 'react';

import { styled } from '../styled.js';

function Divider ({ className = '' }: DividerProps): React.ReactElement {
  return (
    <StyledDiv className={`${className} ui--Menu__Divider`} />
  );
}

const StyledDiv = styled.div`
  margin: 0.25rem 0 1rem;
  border-top: 1px solid var(--border-table);

  &:first-child, &:last-child {
    display: none
  }
`;

export default React.memo(Divider);
