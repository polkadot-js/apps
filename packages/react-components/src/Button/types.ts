// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type { BareProps } from '../types';

export type Button$Callback = () => void | Promise<void>;

export interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  dataTestId?: string;
  icon: IconName;
  isBasic?: boolean;
  isBusy?: boolean;
  isCircular?: boolean;
  isDisabled?: boolean;
  isFull?: boolean;
  isIcon?: boolean;
  isSelected?: boolean;
  isToplevel?: boolean;
  label?: React.ReactNode;
  onClick?: Button$Callback;
  onMouseEnter?: Button$Callback;
  onMouseLeave?: Button$Callback;
  tabIndex?: number;
  tooltip?: React.ReactNode;
  withoutLink?: boolean;
}

export type DividerProps = BareProps;

export interface GroupProps {
  children?: React.ReactNode;
  className?: string;
  isCentered?: boolean;
}

export type ButtonType = React.ComponentType<ButtonProps> & {
  Group: React.ComponentType<GroupProps>;
};
