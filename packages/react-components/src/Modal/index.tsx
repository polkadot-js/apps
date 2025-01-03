// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createGlobalStyle } from 'styled-components';

import { useTheme } from '@polkadot/react-hooks';

import ErrorBoundary from '../ErrorBoundary.js';
import { styled } from '../styled.js';
import Actions from './Actions.js';
import Columns from './Columns.js';
import Content from './Content.js';
import Header from './Header.js';

interface Props {
  size?: 'large' | 'medium' | 'small';
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  open?: boolean;
  onClose: () => void;
  testId?: string;
}

function ModalBase ({ children, className = '', header, onClose, size = 'medium', testId = 'modal' }: Props): React.ReactElement<Props> {
  const { themeClassName } = useTheme();

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
    <StyledDiv
      className={`${className} ui--Modal ${size}Size ${themeClassName} `}
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
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </div>
    </StyledDiv>,
    document.body
  );
}

const DisableGlobalScroll = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

const StyledDiv = styled.div`
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
`;

const Modal = React.memo(ModalBase) as unknown as typeof ModalBase & {
  Actions: typeof Actions;
  Columns: typeof Columns;
  Content: typeof Content;
};

Modal.Actions = Actions;
Modal.Columns = Columns;
Modal.Content = Content;

export default Modal;
