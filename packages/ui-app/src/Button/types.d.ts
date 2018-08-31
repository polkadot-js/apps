// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '../types';

export type Button$Sizes = 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';

export type ButtonProps = BareProps & {
  children?: React.ReactNode,
  floated?: 'left' | 'right',
  icon?: string,
  isBasic?: boolean,
  isCircular?: boolean,
  isDisabled?: boolean,
  isNegative?: boolean,
  isPositive?: boolean,
  isPrimary?: boolean,
  onClick?: () => void | Promise<void>,
  size?: Button$Sizes,
  tabIndex?: number,
  text?: any
};

export type DividerProps = BareProps;

export type GroupProps = BareProps & {
  children?: React.ReactNode
};

export type GroupType = React.ComponentType<GroupProps> & {
  Divider: React.ComponentType<DividerProps>
}

export type ButtonType = React.ComponentType<ButtonProps> & {
  Divider: React.ComponentType<DividerProps>,
  Group: GroupType,
  Or: React.ComponentType<BareProps>
}
