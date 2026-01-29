// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { styled } from '../styled.js';

interface Props {
  children: React.ReactNode;
  className?: string;
}

function BaseChart ({ children, className = '' }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv className={`${className} ui--Chart`}>
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
