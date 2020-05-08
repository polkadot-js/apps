// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React, { useCallback } from 'react';

import Bytes from './Bytes';
import BytesFile from './File';

function Code ({ className, defaultValue, isDisabled, isError, label, onChange, onEnter, onEscape, style, type, withLabel }: Props): React.ReactElement<Props> {
  // TODO: Validate that we have actual proper WASM code
  const _onChange = useCallback(
    (value: Uint8Array) =>
      onChange && onChange({
        isValid: value.length !== 0,
        value
      }),
    [onChange]
  );

  if (isDisabled) {
    return (
      <Bytes
        className={className}
        defaultValue={defaultValue}
        isError={isError}
        label={label}
        onEnter={onEnter}
        onEscape={onEscape}
        style={style}
        type={type}
        withLabel={withLabel}
      />
    );
  }

  return (
    <BytesFile
      className={className}
      defaultValue={defaultValue}
      isError={isError}
      label={label}
      onChange={_onChange}
      style={style}
      withLabel={withLabel}
    />
  );
}

export default React.memo(Code);
