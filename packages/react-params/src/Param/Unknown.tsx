// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props as BaseProps } from '../types';

import React from 'react';

import BaseBytes from './BaseBytes';
import Static from './Static';

interface Props extends BaseProps {
  children?: React.ReactNode;
}

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
