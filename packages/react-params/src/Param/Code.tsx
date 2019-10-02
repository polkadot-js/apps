// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';

import Bytes from './Bytes';
import BytesFile from './File';

function renderDisabled ({ className, defaultValue, isError, label, onEnter, style, type, withLabel }: Props): React.ReactNode {
  return (
    <Bytes
      className={className}
      defaultValue={defaultValue}
      isError={isError}
      label={label}
      onEnter={onEnter}
      style={style}
      type={type}
      withLabel={withLabel}
    />
  );
}

// TODO: Validate that we have actual proper WASM code
function onChange ({ onChange }: Props): (_: Uint8Array) => void {
  return function (value: Uint8Array): void {
    onChange && onChange({
      isValid: value.length !== 0,
      value
    });
  };
}

export default function Code (props: Props): React.ReactElement<Props> {
  const { className, defaultValue, isDisabled, isError, label, style, withLabel } = props;

  if (isDisabled) {
    return (
      <>
        {renderDisabled(props)}
      </>
    );
  }

  return (
    <BytesFile
      className={className}
      defaultValue={defaultValue}
      isError={isError}
      label={label}
      onChange={onChange(props)}
      style={style}
      withLabel={withLabel}
    />
  );
}
