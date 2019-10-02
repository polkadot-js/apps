// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BareProps, RawParam } from '../types';

import React from 'react';

import BaseBytes from './BaseBytes';
import Static from './Static';

interface Props extends BareProps {
  defaultValue: RawParam;
  withLabel?: boolean;
}

export default function Unknown (props: Props): React.ReactElement<Props> {
  const { className, defaultValue, isDisabled, isError, label, name, onChange, onEnter, style, type } = props;

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
      style={style}
      type={type}
      withLength={false}
    />
  );
}
