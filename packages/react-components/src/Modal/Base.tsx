// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '../types';
import type { ModalProps } from './types';

import React, { useCallback, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { createGlobalStyle, ThemeContext } from 'styled-components';

import Header from './Header';

interface OverlayProps {
  className?: string;
}

const ESC_KEYCODE = 27;

function OverlayBase ({ className }: OverlayProps): React.ReactElement<OverlayProps> {
  return <div className={className} />;
}

const Overlay = React.memo(styled(OverlayBase)`
  background: rgba(96, 96, 96, 0.5);
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000; /* below status */
`);

function Base (props: ModalProps): React.ReactElement<ModalProps> {
  const { theme } = useContext(ThemeContext as React.Context<ThemeDef>);
  const { children, className = '', header, onClose, size = 'medium', testId = 'modal' } = props;

  const listenKeyboard = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' || event.keyCode === ESC_KEYCODE) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', listenKeyboard, true);

    return () => {
      window.removeEventListener('keydown', listenKeyboard, true);
    };
  }, [listenKeyboard]);

  return createPortal(
    <>
      <DisableGlobalScroll />
      <Overlay />
      <div
        className={`theme--${theme} ui--Modal ${className} size-${size}`}
        data-testid={testId}
        onClick={onClose}
      >
        <div className='ui--Modal__body'>
          <Header
            header={header}
            onClose={onClose}
          />
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}

const DisableGlobalScroll = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

export default React.memo(styled(Base)`
  height: 100%;
  left: 0;
  position: fixed;
  min-height: 100vh;
  top: 0;
  width: 100%;
  overflow-y: auto;
  z-index: 1002; /* above status */

  .ui--Modal__body {
    background: var(--bg-page);
    border-radius: 4px;
    box-shadow: none;
    color: var(--color-text);
    display: flex;
    flex-direction: column;
    font: var(--font-sans);
    left: 50%;
    margin-top: 30px;
    max-width: 900px;
    position: absolute;
    top: 0;
    transform: translate(-50%, 0);
    width: calc(100% - 16px);
  }

  &.size-small .ui--Modal__body {
    max-width: 720px;
  }

  &.size-large .ui--Modal__body {
    max-width: 1080px;
  }
`);
