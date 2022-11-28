// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export type HorizontalPosition = 'left' | 'middle' | 'right'
export type VerticalPosition = 'top' | 'bottom'

export interface PopupWindowProps {
  className?: string;
  children?: React.ReactNode;
  windowRef: React.RefObject<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLDivElement>;
  position: HorizontalPosition;
}

export interface PopupProps {
  isDisabled?: boolean;
  className?: string;
  closeOnScroll?: boolean;
  value?: React.ReactNode;
  children?: React.ReactNode;
  position?: HorizontalPosition;
  onCloseAction?: () => void;
}
