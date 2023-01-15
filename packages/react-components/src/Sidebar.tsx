// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import Button from './Button';

interface Props {
  button?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  offset?: number | string;
  onClose?: () => void;
  position: 'left' | 'right';
  sidebarRef: React.RefObject<HTMLDivElement>;
}

function Sidebar ({ button, children, className = '', dataTestId = '', onClose, sidebarRef }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv
      className={`ui--Sidebar ${className}`}
      data-testid={dataTestId}
      ref={sidebarRef}
    >
      <Button.Group className='ui--Sidebar-buttons'>
        {button}
        <Button
          dataTestId='close-sidebar-button'
          icon='times'
          isBasic
          isCircular
          onClick={onClose}
        />
      </Button.Group>
      {children}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  background: var(--bg-page);
  bottom: 0;
  // left
  // box-shadow: 6px 0px 20px 0px rgba(0, 0, 0, 0.3);
  box-shadow: -6px 0px 20px 0px rgba(0, 0, 0, 0.3);
  margin-left: -0.125rem;
  max-width: 24rem;
  min-width: 24rem;
  position: fixed;
  padding: 1rem;
  right: 0;
  overflow-y: auto;
  top: 0;
  z-index: 999;

  .ui--Sidebar-buttons {
    margin: 0;
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }
`;

export default React.memo(Sidebar);
