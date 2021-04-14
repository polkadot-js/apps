// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Icon as IconType, IconName } from '@fortawesome/fontawesome-svg-core';

type Button$Callback = () => void | Promise<void>;

export interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  icon?: IconName | IconType;
  isBasic?: boolean;
  isBusy?: boolean;
  isCircular?: boolean;
  isDisabled?: boolean;
  isFull?: boolean;
  isIcon?: boolean;
  isNegative?: boolean;
  isPrimary?: boolean;
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

export interface GroupProps {
  children?: React.ReactNode;
  className?: string;
  isCentered?: boolean;
}

export type ButtonType = React.ComponentType<ButtonProps> & {
  Group: React.ComponentType<GroupProps>;
};
