// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PopupWindowProps, WindowProps } from './types';

import React from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

import { useElementPosition } from '@polkadot/react-hooks';

import { getPosition } from './utils';

export const PopupWindow: React.FC<PopupWindowProps> = ({ children, position, setRef, triggerPosition }) => {
  const windowPosition = useElementPosition(setRef);

  return createPortal(
    <Window
      positionX={position}
      positionY={triggerPosition.verticalPosition}
      ref={setRef}
      windowPosition={getPosition(triggerPosition, position, triggerPosition.verticalPosition, windowPosition)}
    >
      {children}
    </Window>,
    document.body
  );
};

const Window = styled.div<WindowProps>`
  position: absolute;
  top:0;
  left:0;
  z-index: 100;

  margin: 0.7rem 0;
  padding: 0.85rem 1rem;

  color: var(--color-text);
  background-color: var(--bg-menu);
  border-radius: 4px;
  border: 1px solid #d4d4d5;
  box-shadow: 0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%);

 transform: translate3d(${({ windowPosition }) =>
    `${windowPosition.x}px, ${windowPosition.y}px, 0`});

  &::before {
    position: absolute;
    right: 50%;
    top: unset;
    bottom: -0.3rem;
    box-shadow: 1px 1px 0 0 #bababc;

    ${({ positionY }) => positionY === 'bottom' && css`
      box-shadow: -1px -1px 0 0 #bababc;

      top: -0.3rem;
      bottom: unset;
    `}

    ${({ positionX }) => positionX === 'left' && css`
      left: unset;
      right: 0.8rem;
    `}

    ${({ positionX }) => positionX === 'right' && css`
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
`;
