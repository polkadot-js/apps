// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

export const TabsSectionDelimiter = (): React.ReactElement => (
  <Wrapper>
    <svg fill='none'
      height='65'
      viewBox='0 0 17 65'
      width='17'
      xmlns='http://www.w3.org/2000/svg'>
      <path d='M1 1L16 32.5L1 64'
        stroke='#DFDFDF'/>
    </svg>
  </Wrapper>
);

const Wrapper = styled.div`
  width: 1.07rem;
  margin: 0 1.21rem 0  2.35rem;

  svg {
    height: 100%;
    transform: translateY(1px);
  }
`;
