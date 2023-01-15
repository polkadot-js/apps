// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderProps } from './types';

import React from 'react';
import styled from 'styled-components';

import Button from '../Button';

function Header ({ className = '', header, onClose }: HeaderProps) {
  return (
    <StyledDiv className={`${className} ui--Modal__Header`}>
      {header && (
        <h1>{header}</h1>
      )}
      <Button
        dataTestId='close-modal'
        icon='times'
        onClick={onClose}
      />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem 0;
`;

export default React.memo(Header);
