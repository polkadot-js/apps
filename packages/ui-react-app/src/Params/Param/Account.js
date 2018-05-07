// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';

import InputAddress from '../../InputAddress';
import Base from './Base';

export default function Account ({ index, isError, label, onChange, t, value: { options: { initValue } = {} } }: Props): React$Node {
  // flowlint-next-line unclear-type:off
  const defaultValue = ((initValue: any): Uint8Array);
  const _onChange = (value?: Uint8Array): void =>
    onChange(index, {
      isValid: !!value && value.length === 32,
      value
    });

  return (
    <Base
      label={label}
      size='large'
    >
      <InputAddress
        defaultValue={defaultValue}
        label={label}
        onChange={_onChange}
        placeholder='0x...'
      />
    </Base>
  );
}
