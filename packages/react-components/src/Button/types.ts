// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '../types';

export type Button$Sizes = 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';

export type Button$OnClick = () => void | Promise<void>;

export interface ButtonProps extends BareProps {
  children?: React.ReactNode;
  floated?: 'left' | 'right';
  icon: string;
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
  onClick?: Button$OnClick;
  ref?: any;
  size?: Button$Sizes;
  tabIndex?: number;
  tooltip?: React.ReactNode;
}

export type DividerProps = BareProps;

export interface GroupProps extends BareProps {
  children?: React.ReactNode;
  isBasic?: boolean;
  isCentered?: boolean;
}

export type GroupType = React.ComponentType<GroupProps> & {
  Divider: React.ComponentType<DividerProps>;
};

export type ButtonType = React.ComponentType<ButtonProps> & {
  Divider: React.ComponentType<DividerProps>;
  Group: GroupType;
  Or: React.ComponentType<BareProps>;
};
