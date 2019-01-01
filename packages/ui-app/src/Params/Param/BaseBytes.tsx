// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BaseProps, Size } from '../types';

import React from 'react';
import { Compact } from '@polkadot/types/codec';
import { hexToU8a, u8aToHex } from '@polkadot/util';

import Input from '../../Input';
import Bare from './Bare';

type Props = BaseProps & {
  children?: React.ReactNode,
  length?: number,
  size?: Size,
  validate?: (u8a: Uint8Array) => boolean,
  withLength?: boolean
};

const defaultValidate = (u8a: Uint8Array): boolean =>
  true;

export default class BaseBytes extends React.PureComponent<Props> {
  render () {
    const { children, className, defaultValue: { value }, isDisabled, isError, label, size = 'full', style, withLabel } = this.props;
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
          isAction={!!children}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          onChange={this.onChange}
          placeholder='0x...'
          type='text'
          withLabel={withLabel}
        >
          {children}
        </Input>
      </Bare>
    );
  }

  private onChange = (hex: string): void => {
    const { length = -1, onChange, validate = defaultValidate, withLength } = this.props;

    let value: Uint8Array;

    try {
      value = hexToU8a(hex);
    } catch (error) {
      value = new Uint8Array([]);
    }

    let isValid = validate(value) && length !== -1
      ? value.length === length
      : value.length !== 0;

    if (withLength && isValid) {
      value = Compact.addLengthPrefix(value);
    }

    onChange && onChange({
      isValid,
      value
    });
  }
}
