// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../types';

import './Button.css';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/es/elements/Button';

import ButtonGroup from './Group';
import ButtonOr from './Or';

export type Button$Sizes = 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';

type Props = BareProps & {
  children?: React$Node,
  icon?: string,
  isCircular?: boolean,
  isDisabled?: boolean,
  isNegative?: boolean,
  isPrimary?: boolean,
  onClick?: () => void | Promise<void>,
  size?: Button$Sizes,
  // flowlint-next-line unclear-type:off
  text?: any
};

function Button ({ children, className, icon, isCircular = false, isDisabled = false, isNegative = false, isPrimary = false, onClick, size, style, text }: Props): React$Node {
  const props = {
    circular: isCircular,
    className,
    disabled: isDisabled,
    icon,
    negative: isNegative,
    onClick,
    primary: isPrimary,
    size,
    style
  };

  // flowlint-next-line sketchy-null:off
  return text || children
    ? (
      <SUIButton {...props}>
        {text}{children}
      </SUIButton>
    )
    : (
      <SUIButton {...props} />
    );
}

Button.Group = ButtonGroup;
Button.Or = ButtonOr;

export default Button;
