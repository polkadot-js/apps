// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ElementPosition } from '@polkadot/react-hooks/useElementPosition';

import React from 'react';

export type HorizontalPosition = 'left' | 'middle' | 'right'
export type VerticalPosition = 'top' | 'bottom'

export interface PopupWindowProps {
  className?: string;
  children?: React.ReactNode;
  setRef: React.RefObject<HTMLDivElement>;
  position: HorizontalPosition;
  triggerPosition: ElementPosition;
}

export interface PopupProps {
  isDisabled?: boolean;
  className?: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
  position?: HorizontalPosition;
  onCloseAction?: () => void;
}
