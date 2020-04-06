// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '../types';

export type Button$Sizes = 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';

export type Button$Callback = () => void | Promise<void>;

export interface ButtonProps extends BareProps {
  children?: React.ReactNode;
  floated?: 'left' | 'right';
  icon?: string;
  isAnimated?: boolean;
  isBasic?: boolean;
  isCircular?: boolean;
  isDisabled?: boolean;
  isFluid?: boolean;
  isIcon?: boolean;
  isLoading?: boolean;
  isNegative?: boolean;
  isPositive?: boolean;
  isPrimary?: boolean;
  label?: React.ReactNode;
  labelPosition?: 'left' | 'right';
  onClick?: Button$Callback;
  onMouseEnter?: Button$Callback;
  onMouseLeave?: Button$Callback;
  ref?: any;
  size?: Button$Sizes;
  tabIndex?: number;
  tooltip?: React.ReactNode;
}

export type DividerProps = BareProps;

export interface ContentProps extends BareProps {
  children?: React.ReactNode;
  hidden?: boolean;
  visible?: boolean;
}

export interface GroupProps extends BareProps {
  children?: React.ReactNode;
  isBasic?: boolean;
  isCentered?: boolean;
}

export type GroupType = React.ComponentType<GroupProps> & {
  Divider: React.ComponentType<DividerProps>;
};

export type ButtonType = React.ComponentType<ButtonProps> & {
  Content: React.ComponentType<ContentProps>;
  Divider: React.ComponentType<DividerProps>;
  Group: GroupType;
  Or: React.ComponentType<BareProps>;
};
