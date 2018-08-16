// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props, RawParam$OnChange$Value } from '../types';

import React from 'react';

import Amount from './Amount';
import Static from '../../Static';

export default class Code extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isDisabled, isError, label, style, withLabel } = this.props;
    const Component = isDisabled
      ? Static
      : Amount;

    return (
      <Component
        className={className}
        defaultValue={
          isDisabled
            ? ((defaultValue && defaultValue.value) ? defaultValue.value.toString() : '')
            : defaultValue
        }
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={this.onChange}
        style={style}
        withLabel={withLabel}
      />
    );
  }

  // TODO: Validate that we have actual proper WASM code
  onChange = (value: RawParam$OnChange$Value): void => {
    const { onChange } = this.props;

    onChange && onChange(value);
  }
}
