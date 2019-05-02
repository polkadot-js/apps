// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ButtonProps } from './types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';

import { isUndefined } from '@polkadot/util';

export default class Button extends React.PureComponent<ButtonProps> {
  render () {
    const { children, className, floated, icon, isBasic = false, isCircular = false, isDisabled = false, isLoading = false, isNegative = false, isPositive = false, isPrimary = false, label, onClick, size, style, tabIndex } = this.props;

    const props = {
      basic: isBasic,
      circular: isCircular,
      className,
      disabled: isDisabled,
      floated,
      icon,
      loading: isLoading,
      negative: isNegative,
      onClick,
      positive: isPositive,
      primary: isPrimary,
      size,
      secondary: !isBasic && !(isPositive || isPrimary || isNegative),
      style,
      tabIndex
    };

    return isUndefined(label) && isUndefined(children)
      ? (
        <SUIButton {...props} />
      )
      : (
        <SUIButton {...props}>
          {label}{children}
        </SUIButton>
      );
  }
}
