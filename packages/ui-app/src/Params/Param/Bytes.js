// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props as BaseProps, Size } from '../types';

import React from 'react';

import hexToU8a from '@polkadot/util/hex/toU8a';

import Input from '../../Input';
import Bare from './Bare';

type Props = BaseProps & {
  length?: number,
  size?: Size,
  validate?: (u8a: Uint8Array) => boolean
}

const defaultValidate = (u8a: Uint8Array): boolean =>
  true;

export default class Bytes extends React.PureComponent<Props> {
  render (): React$Node {
    const { className, isDisabled, isError, label, size = 'full', style, withLabel } = this.props;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className={size}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          onChange={this.onChange}
          placeholder='0x...'
          type='text'
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  onChange = (hex: string): void => {
    const { index, length = -1, onChange, validate = defaultValidate } = this.props;

    let u8a;

    try {
      u8a = hexToU8a(hex);
    } catch (error) {
      u8a = new Uint8Array([]);
    }

    const isValidLength = length !== -1
      ? u8a.length === length
      : u8a.length !== 0;

    onChange(index, {
      isValid: isValidLength && validate(u8a),
      value: u8a
    });
  };
}
