// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BaseProps } from './types';

import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  padding: 1em 1em 0;
  height: 15vw;
  width: 15vw;
`;

function BaseChart ({ children, className = '' }: BaseProps): React.ReactElement<BaseProps> {
  return (
    <Wrapper className={`ui--Chart ${className}`}>
      {children}
    </Wrapper>
  );
}

export default React.memo(BaseChart);
