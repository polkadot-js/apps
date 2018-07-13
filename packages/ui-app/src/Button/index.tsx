// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ButtonProps, ButtonType } from './types';

import './Button.css';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';

import isUndefined from '@polkadot/util/is/undefined';

import Divider from './Divider';
import Group from './Group';
import Or from './Or';

class Button extends React.PureComponent<ButtonProps> {
  render () {
    const { children, className, floated, icon, isBasic = false, isCircular = false, isDisabled = false, isNegative = false, isPrimary = false, onClick, size, style, text } = this.props;

    const props = {
      basic: isBasic || false,
      circular: isCircular,
      className,
      disabled: isDisabled,
      floated,
      icon,
      negative: isNegative,
      onClick,
      primary: isPrimary,
      size,
      secondary: isBasic && !(isPrimary || isNegative || false),
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
}

(Button as ButtonType).Divider = Divider;
(Button as ButtonType).Group = Group;
(Button as ButtonType).Or = Or;

export default (Button as ButtonType);
