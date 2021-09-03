// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PopupProps } from './types';

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { Button } from '@polkadot/react-components/index';
import { useOutsideClick, useToggle } from '@polkadot/react-hooks';

import PopupWindow from './PopupWindow';

function Popup ({ children, className = '', isDisabled = false, onCloseAction, position = 'left', value }: PopupProps) {
  const [isOpen, toggleIsOpen, setIsOpen] = useToggle(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick([triggerRef, dropdownRef], () => setIsOpen(false));

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
