// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconName } from '@fortawesome/fontawesome-svg-core';
import React from 'react';

export interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ItemProps {
  children?: React.ReactNode;
  className?: string;
  icon?: IconName;
  isDisabled?: boolean;
  onClick?: () => void | Promise<void> | null;
}

export interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

export interface DividerProps {
  className?: string;
}
