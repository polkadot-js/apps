// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';

import { useToggle } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
  position?: 'left' | 'middle' | 'right'
  onCloseAction?: () => void;
}

const Popup: React.FC<Props> = ({ children, className = '', onCloseAction, position = 'left', value }): React.ReactElement | null => {
  const [isOpen, toggleIsOpen] = useToggle(false);

  useEffect(() => {
    if (!isOpen && onCloseAction) {
      onCloseAction();
    }
  }, [isOpen, onCloseAction]);

  return (
    <PopupWrapper>
      {isOpen && (
        <PopupWindow position={position}>
          { value }
        </PopupWindow>
      )}
      <PopupTrigger
        className={`ui--Popup ${className}`}
        onClick={toggleIsOpen}
      >
        {children}
      </PopupTrigger>
    </PopupWrapper>
  );
};

export default React.memo(Popup);

const PopupWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const PopupTrigger = styled.div`
`;

interface WindowProps {
  position: 'left' | 'middle' | 'right'
}

const PopupWindow = styled.div<WindowProps>`
  position: absolute;
  margin-top: 0.7rem;
  top: 100%;
  //bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;

  ${({ position }) => position === 'left' && css`
    transform: none;
    left: unset;
    right: 0;
  `}

  ${({ position }) => position === 'right' && css`
    transform: none;
    left: 0;
    right: unset;
  `}

  color: var(--color-text);
  background-color: var(--bg-menu);
  border-radius: 4px;
  padding: 0.85rem 1rem;
  border: 1px solid #d4d4d5;
  box-shadow: 0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%);

  &::before {
    position: absolute;
    top: -0.3rem;
    right: 50%;


    ${({ position }) => position === 'left' && css`
      left: unset;
      right: 0.8rem;
    `}

    ${({ position }) => position === 'right' && css`
      left: 0.8rem;
      right: unset;
    `}

    content: '';

    background-color: var(--bg-menu);
    box-shadow: -1px -1px 0 0 #bababc;

    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    z-index: 2;
    }

  .ui.text.menu .item {
    color: var(--color-text) !important;
    text-align: left;

    &.disabled {
     opacity: 0.3;
    }
}
`;
