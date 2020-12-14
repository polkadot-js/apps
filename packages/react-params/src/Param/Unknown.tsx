// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types';

import React from 'react';

import BaseBytes from './BaseBytes';
import Static from './Static';

function Unknown (props: Props): React.ReactElement<Props> {
  const { className = '', defaultValue, isDisabled, isError, label, name, onChange, onEnter, onEscape, type } = props;

  if (isDisabled) {
    return <Static {...props} />;
  }

  return (
    <BaseBytes
      asHex
      className={className}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      label={label}
      length={-1}
      name={name}
      onChange={onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      type={type}
      withLength={false}
    />
  );
}

export default React.memo(Unknown);
