// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IconName } from '@fortawesome/fontawesome-svg-core';
import { BareProps } from '../types';

export type Button$Callback = () => void | Promise<void>;

export interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  icon: IconName;
  isBasic?: boolean;
  isBusy?: boolean;
  isCircular?: boolean;
  isDisabled?: boolean;
  isFull?: boolean;
  isIcon?: boolean;
  isSelected?: boolean;
  label?: React.ReactNode;
  onClick?: Button$Callback;
  onMouseEnter?: Button$Callback;
  onMouseLeave?: Button$Callback;
  tabIndex?: number;
  tooltip?: React.ReactNode;
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
