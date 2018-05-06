// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';

import InputAddress from '../../InputAddress';
import doChange from '../../util/doChange';
import Base from './Base';

export default function Account ({ isError, label, onChange, t, value: { options: { initValue } = {} } }: Props): React$Node {
  const _onChange = (value?: Uint8Array): void =>
    doChange({
      isValid: !!value && value.length === 32,
      value
    }, onChange);

  return (
    <Base
      label={label}
      size='large'
    >
      <InputAddress
        defaultValue={initValue}
        label={label}
        onChange={_onChange}
        placeholder='0x...'
      />
    </Base>
  );
}
