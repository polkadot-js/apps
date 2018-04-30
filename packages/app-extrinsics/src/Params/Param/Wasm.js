// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';

import BytesFile from './File';

export default function Wasm ({ isError, label, subject }: Props): React$Node {
  const onChange = (file?: File, value?: Uint8Array) => {
    // TODO: Validate that we have actual proper WASM code
    subject.next({
      data: file,
      isValid: !!value && value.length !== 0,
      value
    });
  };

  return (
    <BytesFile
      isError={isError}
      label={label}
      onChange={onChange}
      subject={subject}
    />
  );
}
