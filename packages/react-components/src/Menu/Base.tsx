// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BaseProps } from './types';

import React from 'react';
import styled from 'styled-components';

function Base ({ children, className = '' }: BaseProps): React.ReactElement<BaseProps> {
  return (
    <StyledDiv className={`ui--Menu ${className}`}>
      {children}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 14.286rem;
  margin: 1rem 0;

  & > *:not(.ui--Menu__Item):not(.ui--Menu__Divider) {
    margin-right: 1rem;
    margin-left: 1rem;
  }
`;

export default React.memo(Base);
