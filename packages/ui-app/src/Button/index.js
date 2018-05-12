// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../types';

import './Button.css';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/es/elements/Button';

import isUndefined from '@polkadot/util/is/undefined';

import Divider from './Divider';
import Group from './Group';
import Or from './Or';

export type Button$Sizes = 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';

type Props = BareProps & {
  children?: React$Node,
  floated?: 'left' | 'right',
  icon?: string,
  isBasic?: boolean,
  isCircular?: boolean,
  isDisabled?: boolean,
  isNegative?: boolean,
  isPrimary?: boolean,
  onClick?: () => void | Promise<void>,
  size?: Button$Sizes,
  // flowlint-next-line unclear-type:off
  text?: any
};

function Button ({ children, className, floated, icon, isBasic = false, isCircular = false, isDisabled = false, isNegative = false, isPrimary = false, onClick, size, style, text }: Props): React$Node {
  const props = {
    basic: isBasic,
    circular: isCircular,
    className,
    disabled: isDisabled,
    floated,
    icon,
    negative: isNegative,
    onClick,
    primary: isPrimary,
    size,
    secondary: isBasic && !(isPrimary || isNegative),
    style
  };

  return isUndefined(text) && isUndefined(children)
    ? (
      <SUIButton {...props} />
    )
    : (
      <SUIButton {...props}>
        {text}{children}
      </SUIButton>
    );
}

Button.Divider = Divider;
Button.Group = Group;
Button.Or = Or;

export default Button;
