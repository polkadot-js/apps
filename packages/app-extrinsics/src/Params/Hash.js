// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from './types';

import React from 'react';
import Input from 'semantic-ui-react/dist/es/elements/Input';
import hexToU8a from '@polkadot/util/hex/toU8a';

import Base from './Base';

export default function Hash ({ isError, label, subject, t }: Props): React$Node {
  // eslint-disable-next-line no-unused-vars
  const onChange = (event: SyntheticEvent<*>, { value }) => {
    const u8a = hexToU8a(value);

    subject.next({
      isValid: u8a.length === 32,
      value: u8a
    });
  };

  return (
    <Base
      label={label}
      size='small'
    >
      <Input
        error={isError}
        onChange={onChange}
        type='text'
      />
    </Base>
  );
}
