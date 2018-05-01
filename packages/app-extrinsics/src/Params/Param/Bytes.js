// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props as BaseProps, Size } from '../types';

import React from 'react';
import Input from 'semantic-ui-react/dist/es/elements/Input';
import hexToU8a from '@polkadot/util/hex/toU8a';

import Base from './Base';

type Props = BaseProps & {
  length?: number,
  size?: Size,
  validate?: (u8a: Uint8Array) => boolean
}

const defaultValidate = (u8a: Uint8Array): boolean =>
  true;

export default function Bytes ({ isError, length = -1, label, size = 'full', subject, validate = defaultValidate }: Props): React$Node {
  // eslint-disable-next-line no-unused-vars
  const onChange = (event: SyntheticEvent<*>, { value }) => {
    let u8a;

    try {
      u8a = hexToU8a(value);
    } catch (error) {
      u8a = new Uint8Array([]);
    }

    const isValidLength = length !== -1
      ? u8a.length === length
      : u8a.length !== 0;

    subject.next({
      isValid: isValidLength && validate(u8a),
      value: u8a
    });
  };

  return (
    <Base
      label={label}
      size={size}
    >
      <Input
        error={isError}
        onChange={onChange}
        placeholder='0x...'
        type='text'
      />
    </Base>
  );
}
