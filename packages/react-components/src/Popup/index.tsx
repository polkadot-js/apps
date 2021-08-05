// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@polkadot/react-components/index';
import { PopupWindow } from '@polkadot/react-components/Popup/PopupWindow';
import { PopupProps } from '@polkadot/react-components/Popup/types';
import { useElementPosition } from '@polkadot/react-components/Popup/useElementPosition';
import { useOutsideClick } from '@polkadot/react-hooks/useOutsideClick';

const Popup: React.FC<PopupProps> = ({ children, className = '', isDisabled = false, onCloseAction, position = 'left', value }): React.ReactElement | null => {
  const [isOpen, setIsOpen] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const triggerPosition = useElementPosition(triggerRef);

  useOutsideClick(triggerRef, () => setIsOpen(false));

  useEffect(() => {
    if (!isOpen && onCloseAction) {
      onCloseAction();
    }
  }, [isOpen, onCloseAction]);

  console.log('REF:', triggerRef.current);
  console.log('value:', value);

  return (
    <PopupWrapper>
      {isOpen && triggerPosition && (
        <PopupWindow
          position={position}
          triggerPosition={triggerPosition}
        >
          {value}
        </PopupWindow>
      )}
      <PopupTrigger
        className={`ui--Popup ${className}`}
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
  .ui--Button {

  }
`;
