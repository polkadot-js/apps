// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionsProps } from './types';

import React from 'react';
import styled from 'styled-components';

import Button from '../Button';

function Actions ({ children, className = '' }: ActionsProps) {
  return (
    <StyledDiv className={className}>
      <Button.Group>
        {children}
      </Button.Group>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  background-color: var(--bg-input);
  border-radius: 0 0 4px 4px;

  .ui--Button-Group {
    margin: 1rem 1rem;
  }
`;

export default React.memo(Actions);
