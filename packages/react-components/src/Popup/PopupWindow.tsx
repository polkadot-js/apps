// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PopupWindowProps } from './types';

import React from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

import { usePopupWindow } from '@polkadot/react-hooks/usePopupWindow';

function PopupWindow ({ children, className = '', position, triggerRef, windowRef }: PopupWindowProps) {
  const { renderWindowPosition, verticalPosition } = usePopupWindow(windowRef, triggerRef, position);

  return createPortal(
    <div
      className={`${className}${verticalPosition === 'top' ? ' pointerTop' : ' pointerBottom'}`}
      data-testid='popup-window'
      ref={windowRef}
      style={renderWindowPosition && { transform: `translate3d(${renderWindowPosition.x}px, ${renderWindowPosition.y}px, 0)`, zIndex: 1000 }}
    >
      {children}
    </div>,
    document.body
  );
}

export default React.memo(styled(PopupWindow)`
  position: absolute;
  top:0;
  left:0;
  z-index: -1;

  margin: 0.7rem 0;
  padding: 0;

  color: var(--color-text);
  background-color: var(--bg-menu);
  border-radius: 4px;
  border: 1px solid #d4d4d5;
  box-shadow: 0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%);

  &::before {
    position: absolute;
    right: 50%;
    top: unset;
    bottom: -0.45rem;
    box-shadow: 1px 1px 0 0 #bababc;

    ${({ position }) => position === 'left' && css`
      left: unset;
      right: 0.8rem;
    `}

    ${({ position }) => position === 'right' && css`
      left: 0.8rem;
      right: unset;
    `}

    content: '';

    background-color: var(--bg-menu);

    width: 1rem;
    height: 1rem;
    transform: rotate(45deg);
    z-index: 2;
  }

  &.pointerBottom::before {
    box-shadow: -1px -1px 0 0 #bababc;

    top: -0.45rem;
    bottom: unset;
  }

  .ui.text.menu .item {
    color: var(--color-text) !important;
    text-align: left;

    &.disabled {
     opacity: 0.3;
    }
  }

  & > *:not(.ui--Menu) {
    margin-left: 1rem;
    margin-right: 1rem;
  }

  & > *:first-child:not(.ui--Menu) {
    margin-top: 1rem;
  }

  & > *:last-child:not(.ui--Menu) {
    margin-bottom: 1rem;
  }
`);
