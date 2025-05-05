// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PopupWindowProps as Props } from './types.js';

import React from 'react';
import { createPortal } from 'react-dom';

import { usePopupWindow } from '@polkadot/react-hooks/usePopupWindow';

import { styled } from '../styled.js';

function PopupWindow ({ children, className = '', position, triggerRef, windowRef }: Props): React.ReactElement<Props> {
  const { pointerStyle, renderCoords: { x, y } } = usePopupWindow(windowRef, triggerRef, position);

  return createPortal(
    <StyledDiv
      className={`${className} ${pointerStyle}Pointer ${position}Position`}
      data-testid='popup-window'
      ref={windowRef}
      style={
        (x && y && {
          transform: `translate3d(${x}px, ${y}px, 0)`,
          zIndex: 1000
        }) || undefined
      }
    >
      {children}
    </StyledDiv>,
    document.body
  );
}

const StyledDiv = styled.div`
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

  &.leftPosition {
    &::before {
      left: unset;
      right: 0.75rem;
    }
  }

  &.rightPosition {
    &::before {
      left: 0.75rem;
      right: unset;
    }
  }

  &::before {
    background-color: var(--bg-menu);
    bottom: -0.5rem;
    box-shadow: 1px 1px 0 0 #bababc;
    content: '';
    height: 1rem;
    position: absolute;
    right: 50%;
    top: unset;
    width: 1rem;
    transform: rotate(45deg);
    z-index: 2;
  }

  &.bottomPointer::before {
    box-shadow: -1px -1px 0 0 #bababc;

    top: -0.5rem;
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
`;

export default React.memo(PopupWindow);
