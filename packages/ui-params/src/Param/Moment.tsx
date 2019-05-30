// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props, RawParam$OnChange$Value } from '../types';

import React from 'react';
import { Static } from '@polkadot/ui-app';

import Amount from './Amount';

export default class Code extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isDisabled, isError, label, onEnter, style, type, withLabel } = this.props;

    if (isDisabled) {
      return this.renderDisabled();
    }

    return (
      <Amount
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={this.onChange}
        onEnter={onEnter}
        style={style}
        type={type}
        withLabel={withLabel}
      />
    );
  }

  private renderDisabled () {
    const { className, defaultValue, isError, label, style, withLabel } = this.props;

    return (
      <Static
        className={className}
        defaultValue={
          (defaultValue && defaultValue.value)
            ? defaultValue.value.toString()
            : ''
        }
        isError={isError}
        label={label}
        style={style}
        withLabel={withLabel}
      />
    );
  }

  // TODO: Validate that we have actual proper WASM code
  private onChange = (value: RawParam$OnChange$Value): void => {
    const { onChange } = this.props;

    onChange && onChange(value);
  }
}
