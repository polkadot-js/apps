// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type React from 'react';

export interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ItemProps {
  children?: React.ReactNode;
  className?: string;
  icon?: IconName;
  isDisabled?: boolean;
  label?: React.ReactNode;
  onClick?: () => void | Promise<void> | null;
}

export interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

export interface DividerProps {
  className?: string;
}

export type MenuType = React.FC<BaseProps> & {
  Divider: React.FC<DividerProps>;
  Item: React.FC<ItemProps>;
  Header: React.FC<HeaderProps>;
};
