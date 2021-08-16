// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '../types';
import type { ModalProps } from './types';

import React, { useCallback, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { createGlobalStyle, ThemeContext } from 'styled-components';

import Header from './Header';
import { Body, Overlay } from './styled';

const ESC_KEYCODE = 27;

function Base (props: ModalProps): React.ReactElement<ModalProps> {
  const { theme } = useContext<ThemeDef>(ThemeContext);
  const { children, className = '', header, onClose, open = true, size = 'medium', testId = 'modal' } = props;

  const listenKeyboard = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' || event.keyCode === ESC_KEYCODE) {
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
      <DisableGlobalScroll/>
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

const DisableGlobalScroll = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

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
