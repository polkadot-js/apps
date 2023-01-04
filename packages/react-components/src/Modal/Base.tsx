// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ModalProps } from './types';

import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { useTheme } from '@polkadot/react-hooks';

import Header from './Header';

function Base (props: ModalProps): React.ReactElement<ModalProps> {
  const theme = useTheme();
  const { children, className = '', header, onClose, size = 'medium', testId = 'modal' } = props;

  const listenKeyboard = useCallback((event: KeyboardEvent) => {
    // eslint-disable-next-line deprecation/deprecation
    if (event.key === 'Escape' || event.keyCode === 27) {
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
    <div
      className={`${theme} ui--Modal ${className} ${size}Size`}
      data-testid={testId}
    >
      <DisableGlobalScroll />
      <div
        className='ui--Modal__overlay'
        onClick={onClose}
      />
      <div className='ui--Modal__body'>
        <Header
          header={header}
          onClose={onClose}
        />
        {children}
      </div>
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

  .ui--Modal__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(96, 96, 96, 0.5);
  }

  .ui--Modal__body {
    margin-top: 30px;
    background: var(--bg-page);
    border-radius: 4px;
    box-shadow: none;

    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);

    max-width: 900px;
    width: calc(100% - 16px);

    color: var(--color-text);
    font: var(--font-sans);
  }

  &.smallSize .ui--Modal__body {
    max-width: 720px;
  }

  &.largeSize .ui--Modal__body {
    max-width: 1080px;
  }
`);
