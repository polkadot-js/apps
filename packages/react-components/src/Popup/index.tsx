// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { PopupWindow } from '@polkadot/react-components/Popup/PopupWindow';
import { PopupProps } from '@polkadot/react-components/Popup/types';
import { useElementPosition } from '@polkadot/react-components/Popup/useElementPosition';
import { useToggle } from '@polkadot/react-hooks';

const Popup: React.FC<PopupProps> = ({ children, className = '', onCloseAction, position = 'left', value }): React.ReactElement | null => {
  const [isOpen, toggleIsOpen] = useToggle(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const triggerPosition = useElementPosition(triggerRef);

  useEffect(() => {
    if (!isOpen && onCloseAction) {
      onCloseAction();
    }
  }, [isOpen, onCloseAction]);

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
        onClick={toggleIsOpen}
        ref={triggerRef}
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
