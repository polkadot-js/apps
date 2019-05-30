// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';

import Bytes from './Bytes';
import BytesFile from './File';

export default class Code extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isDisabled, isError, label, style, withLabel } = this.props;

    if (isDisabled) {
      return this.renderDisabled();
    }

    return (
      <BytesFile
        className={className}
        defaultValue={defaultValue}
        isError={isError}
        label={label}
        onChange={this.onChange}
        style={style}
        withLabel={withLabel}
      />
    );
  }

  private renderDisabled () {
    const { className, defaultValue, isError, label, onEnter, style, type, withLabel } = this.props;

    return (
      <Bytes
        className={className}
        defaultValue={defaultValue}
        isError={isError}
        label={label}
        onEnter={onEnter}
        style={style}
        type={type}
        withLabel={withLabel}
      />
    );
  }

  // TODO: Validate that we have actual proper WASM code
  private onChange = (value: Uint8Array): void => {
    const { onChange } = this.props;

    onChange && onChange({
      isValid: value.length !== 0,
      value
    });
  }
}
