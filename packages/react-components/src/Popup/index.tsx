// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { PopupWindow } from '@polkadot/react-components/Popup/PopupWindow';
import { useElementPosition } from '@polkadot/react-components/Popup/useElementPosition';
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

  const ref = useRef<HTMLDivElement>();
  const triggerPosition = useElementPosition(ref);

  useEffect(() => {
    if (!isOpen && onCloseAction) {
      onCloseAction();
    }
  }, [isOpen, onCloseAction]);

  return (
    <PopupWrapper>
      {isOpen && (
        <PopupWindow
          elementPosition={triggerPosition}
          position={position}
        >
          {value}
        </PopupWindow>
      )}
      <PopupTrigger
        className={`ui--Popup ${className}`}
        onClick={toggleIsOpen}
        ref={ref}
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
