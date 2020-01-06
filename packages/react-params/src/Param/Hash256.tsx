// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';

import BaseBytes from './BaseBytes';

export default function Hash256 ({ className, defaultValue, isDisabled, isError, label, name, onChange, onEnter, onEscape, style, type, withLabel }: Props): React.ReactElement<Props> {
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
      onEnter={onEnter}
      onEscape={onEscape}
      style={style}
      type={type}
      withLabel={withLabel}
    />
  );
}
