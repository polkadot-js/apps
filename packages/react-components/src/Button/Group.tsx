// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { styled } from '../styled.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  isCentered?: boolean;
}

function ButtonGroup ({ children, className = '', isCentered }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv className={`${className} ui--Button-Group ${isCentered ? 'isCentered' : ''}`}>
      {children}
      <div className='clear' />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  margin: 1rem 0;
  text-align: right;

  & .clear {
    clear: both;
  }

  &.isCentered {
    margin-bottom: 0.5rem;
    text-align: center;
  }

  &+.ui--Table {
    margin-top: 1.5rem;
  }

  .ui--Button {
    margin: 0 0.25rem;
  }

  .ui--CopyButton {
    display: inline-block;
  }

  .ui--ToggleGroup, .ui--Dropdown {
    float: left;
  }
`;

export default React.memo(ButtonGroup);
