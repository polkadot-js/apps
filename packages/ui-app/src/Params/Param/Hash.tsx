// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';

import BaseBytes from './BaseBytes';

export default function Hash ({ className, defaultValue, isDisabled, isError, label, name, onChange, style, withLabel }: Props) {
  return (
    <BaseBytes
      className={className}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      label={label}
      length={32}
      name={name}
      onChange={onChange}
      size='medium'
      style={style}
      withLabel={withLabel}
    />
  );
}
