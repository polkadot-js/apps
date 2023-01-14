// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BaseProps } from './types';

import React from 'react';
import styled from 'styled-components';

function BaseChart ({ children, className = '' }: BaseProps): React.ReactElement<BaseProps> {
  return (
    <StyledDiv className={`ui--Chart ${className}`}>
      {children}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  position: relative;
  display: inline-block;
  padding: 1em 1em 0;
  height: 15vw;
  width: 15vw;
`;

export default React.memo(BaseChart);
