// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';

import Bytes from './Bytes';

export default function Hash ({ defaultValue: { value }, isDisabled, isError, label, onChange, withLabel }: Props): React$Node {
  const defaultValue = (value: Uint8Array);

  return (
    <Bytes
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      label={label}
      length={32}
      onChange={onChange}
      size='medium'
      withLabel={withLabel}
    />
  );
}
