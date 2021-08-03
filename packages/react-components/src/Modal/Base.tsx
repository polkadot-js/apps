// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { ThemeContext } from 'styled-components';

import { Header } from '@polkadot/react-components/Modal/Header';
import { Body, Overlay } from '@polkadot/react-components/Modal/styled';
import { ModalProps } from '@polkadot/react-components/Modal/types';
import { ThemeDef } from '@polkadot/react-components/types';

function Base (props: ModalProps): React.ReactElement<ModalProps> {
  const { theme } = useContext<ThemeDef>(ThemeContext);
  const { children, className = '', header, onClose, open = true, size = 'medium', testId = 'modal' } = props;

  const listenKeyboard = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' || event.keyCode === 27) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', listenKeyboard, true);
    }

    return () => {
      open && window.removeEventListener('keydown', listenKeyboard, true);
    };
  }, [open, listenKeyboard]);

  return createPortal(
    <div className={`theme--${theme} ui--Modal ${className}`}
      data-testid={testId}>
      <Overlay onClick={onClose}/>
      <Body size={size}>
        <Header header={header}
          onClose={onClose}/>
        {children}
      </Body>
    </div>,
    document.body
  );
}

export default React.memo(styled(Base)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  z-index: 1000;
  overflow-y: auto;
`);
