// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';

import InputAddress from '../../InputAddress';
import Base from './Base';

export default function Account ({ isError, label, subject, t, value: { options: { initValue } = {} } }: Props): React$Node {
  const defaultValue = initValue;
  // eslint-disable-next-line no-unused-vars
  const onChange = (event: SyntheticEvent<*>, value?: Uint8Array): void => {
    subject.next({
      isValid: !!value && value.length === 32,
      value
    });
  };

  return (
    <Base
      label={label}
      size='large'
    >
      <InputAddress
        defaultValue={defaultValue}
        label={label}
        onChange={onChange}
        placeholder='0x...'
      />
    </Base>
  );
}
