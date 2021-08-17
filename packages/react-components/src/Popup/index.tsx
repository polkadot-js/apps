// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PopupProps } from './types';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@polkadot/react-components/index';
import { useElementPosition, useOutsideClick } from '@polkadot/react-hooks';

import PopupWindow from './PopupWindow';

function Popup ({ children, className = '', isDisabled = false, onCloseAction, position = 'left', value }: PopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerPosition = useElementPosition(triggerRef);

  useOutsideClick([triggerRef, dropdownRef], () => setIsOpen(false));

  useEffect(() => {
    if (!isOpen && onCloseAction) {
      onCloseAction();
    }
  }, [isOpen, onCloseAction]);

  return (
    <div className={`ui--Popup ${className}`}>
      {isOpen && triggerPosition && (
        <PopupWindow
          position={position}
          setRef={dropdownRef}
          triggerPosition={triggerPosition}
        >
          {value}
        </PopupWindow>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerRef}
      >
        {children ?? (
          <Button
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
