// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PopupProps } from './types.js';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { useOutsideClick, useTheme, useToggle } from '@polkadot/react-hooks';

import Button from '../Button/index.js';
import { styled } from '../styled.js';
import PopupWindow from './PopupWindow.js';

function Popup ({ children, className = '', closeOnScroll, isDisabled, onCloseAction, position = 'left', value }: PopupProps) {
  const { themeClassName } = useTheme();
  const [isOpen, toggleIsOpen, setIsOpen] = useToggle(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeWindow = useCallback(
    () => setIsOpen(false),
    [setIsOpen]
  );

  const refs = useMemo(
    () => [triggerRef, dropdownRef],
    [triggerRef, dropdownRef]
  );

  useOutsideClick(refs, closeWindow);

  useEffect(() => {
    if (closeOnScroll) {
      document.addEventListener('scroll', closeWindow, true);
    }

    return () => document.removeEventListener('scroll', closeWindow, true);
  }, [closeOnScroll, closeWindow, setIsOpen]);

  useEffect(() => {
    if (!isOpen && onCloseAction) {
      onCloseAction();
    }
  }, [isOpen, onCloseAction]);

  return (
    <StyledDiv className={`${className} ui--Popup ${themeClassName}`}>
      {isOpen && (
        <PopupWindow
          position={position}
          triggerRef={triggerRef}
          windowRef={dropdownRef}
        >
          {value}
        </PopupWindow>
      )}
      <div
        data-testid='popup-open'
        onClick={toggleIsOpen}
        ref={triggerRef}
      >
        {children ?? (
          <Button
            className={isOpen ? 'isOpen' : ''}
            icon='ellipsis-v'
            isDisabled={isDisabled}
            isReadOnly={false}
          />
        )}
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

export default React.memo(Popup);
