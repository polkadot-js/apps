// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import type { Props } from '../types';
import BaseBytes from './BaseBytes';

function Hash512 ({ className = '', defaultValue, isDisabled, isError, label, name, onChange, onEnter, onEscape, type, withLabel }: Props): React.ReactElement<Props> {
  return (
    <BaseBytes
      className={className}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      label={label}
      length={64}
      name={name}
      onChange={onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      type={type}
      withCopy={isDisabled}
      withLabel={withLabel}
    />
  );
}

export default React.memo(Hash512);
