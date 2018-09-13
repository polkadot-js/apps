// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';

import bnToU8a from '@polkadot/util/bn/toU8a';
import u8aConcat from '@polkadot/util/u8a/concat';

import Bytes from './Bytes';
import BytesFile from './File';

export default class Code extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isDisabled, isError, label, style, withLabel } = this.props;
    const Component = isDisabled
      ? Bytes
      : BytesFile;

    return (
      <Component
        className={className}
        defaultValue={defaultValue}
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
  onChange = (value: Uint8Array): void => {
    const { onChange } = this.props;

    onChange && onChange({
      isValid: value.length !== 0,
      value: u8aConcat(bnToU8a(value.length, 32, true), value)
    });
  }
}
