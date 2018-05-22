// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';

import BaseBytes from './BaseBytes';

export default function Bytes ({ className, defaultValue, isDisabled, isError, label, name, onChange, style, withLabel }: Props): React$Node {
  return (
    <BaseBytes
      className={className}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      label={label}
      length={-1}
      name={name}
      onChange={onChange}
      size='full'
      style={style}
      withLabel={withLabel}
    />
  );
}
