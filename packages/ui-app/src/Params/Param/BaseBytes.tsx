// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props as BaseProps, Size } from '../types';

import React from 'react';
import hexToU8a from '@polkadot/util/hex/toU8a';
import bnToU8a from '@polkadot/util/bn/toU8a';
import u8aConcat from '@polkadot/util/u8a/concat';
import u8aToHex from '@polkadot/util/u8a/toHex';

import Input from '../../Input';
import Bare from './Bare';

type Props = BaseProps & {
  length?: number,
  size?: Size,
  validate?: (u8a: Uint8Array) => boolean,
  withLength?: boolean
};

const defaultValidate = (u8a: Uint8Array): boolean =>
  true;

export default class BaseBytes extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, size = 'full', style, withLabel } = this.props;
    const defaultValue = value
      ? u8aToHex(value as Uint8Array, isDisabled ? 256 : -1)
      : undefined;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className={size}
          defaultValue={defaultValue}
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
    const { length = -1, onChange, validate = defaultValidate, withLength = false } = this.props;

    let u8a: Uint8Array;

    try {
      u8a = hexToU8a(hex);
    } catch (error) {
      u8a = new Uint8Array([]);
    }

    const isValidLength = length !== -1
      ? u8a.length === length
      : u8a.length !== 0;
    const isValid = isValidLength && validate(u8a);

    onChange && onChange({
      isValid,
      value: u8aConcat(
        withLength
          ? bnToU8a(u8a.length, 32, true)
          : new Uint8Array([]),
        u8a
      )
    });
  }
}
