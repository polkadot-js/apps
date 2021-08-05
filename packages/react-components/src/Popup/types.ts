// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { ElementPosition } from '@polkadot/react-components/Popup/useElementPosition';

export type HorizontalPosition = 'left' | 'middle' | 'right'
export type VerticalPosition = 'top' | 'bottom'

export interface PopupWindowProps {
  position: HorizontalPosition,
  triggerPosition: ElementPosition,
}

export interface WindowProps {
  positionX: HorizontalPosition,
  positionY: VerticalPosition,
  windowPosition: { x: number, y: number },
}

export interface PopupProps {
  isDisabled?: boolean;
  className?: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
  position?: HorizontalPosition;
  onCloseAction?: () => void;
}
