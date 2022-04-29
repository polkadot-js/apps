// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PopupProps } from './types';

import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { Button } from '@polkadot/react-components/index';
import { useOutsideClick, useToggle } from '@polkadot/react-hooks';

import PopupWindow from './PopupWindow';

function Popup ({ children, className = '', closeOnScroll = false, isDisabled = false, onCloseAction, position = 'left', value }: PopupProps) {
  const [isOpen, toggleIsOpen, setIsOpen] = useToggle(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeWindow = useCallback(() => setIsOpen(false), [setIsOpen]);

  useOutsideClick([triggerRef, dropdownRef], closeWindow);

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
    <div className={`ui--Popup ${className}`}>
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
    </div>
  );
}

export default React.memo(styled(Popup)`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`);
