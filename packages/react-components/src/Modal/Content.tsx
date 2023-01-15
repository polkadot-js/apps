// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ContentProps } from './types';

import React from 'react';
import styled from 'styled-components';

function Content ({ children, className = '' }: ContentProps) {
  return (
    <StyledDiv className={`${className} ui--Modal__Content`}>
      {children}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  padding: 1.5rem;
`;

export default React.memo(Content);
