// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PopupWindowProps } from './types';

import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

import { usePopupWindow } from '@polkadot/react-hooks/usePopupWindow';

function PopupWindow ({ children, className = '', position, triggerRef, windowRef }: PopupWindowProps) {
  const { pointerStyle, renderCoords } = usePopupWindow(windowRef, triggerRef, position);

  const style = useMemo(
    () => ({
      transform: `translate3d(${renderCoords.x}px, ${renderCoords.y}px, 0)`,
      zIndex: 1000
    }),
    [renderCoords]
  );

  return createPortal(
    <div
      className={`${className} ${pointerStyle}Pointer`}
      data-testid='popup-window'
      ref={windowRef}
      style={style}
    >
      {children}
    </div>,
    document.body
  );
}

export default React.memo(styled(PopupWindow)`
  background-color: var(--bg-menu);
  border: 1px solid #d4d4d5;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%);
  color: var(--color-text);
  left: 0;
  margin: 0.7rem 0;
  padding: 0;
  position: absolute;
  top: 0;
  z-index: -1;

  &::before {
    bottom: -0.45rem;
    box-shadow: 1px 1px 0 0 #bababc;
    position: absolute;
    right: 50%;
    top: unset;

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

  &.bottomPointer::before {
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
