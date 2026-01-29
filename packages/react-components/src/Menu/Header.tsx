// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderProps } from './types.js';

import React from 'react';

import { styled } from '../styled.js';

function Header ({ children, className }: HeaderProps): React.ReactElement {
  return (
    <StyledDiv className={className}>
      {children}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  color: var(--color-label);
  font-size: var(--font-size-tiny);
  line-height: 0.857rem;
  margin-bottom: 0.3rem;
`;

export default React.memo(Header);
