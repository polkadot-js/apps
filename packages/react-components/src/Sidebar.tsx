// Copyright 2017-2026 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Button from './Button/index.js';
import { styled } from './styled.js';

interface Props {
  buttons?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  offset?: number | string;
  onClose?: () => void;
  position: 'left' | 'right';
  sidebarRef: React.RefObject<HTMLDivElement>;
}

function Sidebar ({ buttons, children, className = '', dataTestId = '', onClose, position, sidebarRef }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv
      className={`${className} ui--Sidebar ${position}Position`}
      data-testid={dataTestId}
      ref={sidebarRef}
    >
      <Button.Group className='ui--Sidebar-buttons'>
        {buttons}
        <Button
          dataTestId='close-sidebar-button'
          icon='times'
          isBasic
          isCircular
          onClick={onClose}
        />
      </Button.Group>
      <div className='ui--Sidebar-children'>
        {children}
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  background: var(--bg-page);
  bottom: 0;
  margin-left: -0.125rem;
  max-width: 24rem;
  min-width: 24rem;
  position: fixed;
  top: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;

  &.leftPosition {
    box-shadow: 6px 0px 20px 0px rgba(0, 0, 0, 0.3);
    left: 0;
  }

  &.rightPosition {
    box-shadow: -6px 0px 20px 0px rgba(0, 0, 0, 0.3);
    right: 0;
  }

  .ui--Sidebar-buttons {
    margin: 0;
    padding: .75rem 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    flex-shrink: 0;
  }

  .ui--Sidebar-children {
    padding: 0 1rem;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
    padding-bottom: 4rem;
  }
`;

export default React.memo(Sidebar);
