// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PopupWindowProps } from './types';

import React from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

import { useElementPosition } from '@polkadot/react-hooks';

import { getPosition } from './utils';

function PopupWindow ({ children, className = '', position, setRef, triggerPosition }: PopupWindowProps) {
  const windowPosition = useElementPosition(setRef);
  const { x: xPosition, y: yPosition } = getPosition(triggerPosition, position, triggerPosition.verticalPosition, windowPosition);

  return createPortal(
    <div
      className={className}
      ref={setRef}
      style={{ transform: `translate3d(${xPosition}px, ${yPosition}px, 0)` }}
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
  z-index: 300;

  margin: 0.7rem 0;
  padding: 0.85rem 1rem;

  color: var(--color-text);
  background-color: var(--bg-menu);
  border-radius: 4px;
  border: 1px solid #d4d4d5;
  box-shadow: 0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%);

  &::before {
    position: absolute;
    right: 50%;
    top: unset;
    bottom: -0.3rem;
    box-shadow: 1px 1px 0 0 #bababc;

    ${({ triggerPosition }) => triggerPosition.verticalPosition === 'bottom' && css`
      box-shadow: -1px -1px 0 0 #bababc;

      top: -0.3rem;
      bottom: unset;
    `}

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

    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    z-index: 2;
  }

  .ui.text.menu .item {
    color: var(--color-text) !important;
    text-align: left;

    &.disabled {
     opacity: 0.3;
    }
  }
`);
