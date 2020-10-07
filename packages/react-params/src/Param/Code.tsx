// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Props } from '../types';

import React, { useCallback, useState } from 'react';

import Bytes from './Bytes';
import BytesFile from './File';

function Code ({ className = '', defaultValue, isDisabled, isError, label, onChange, onEnter, onEscape, type, withLabel }: Props): React.ReactElement<Props> {
  const [isValid, setIsValid] = useState(false);

  // TODO: Validate that we have actual proper WASM code
  const _onChange = useCallback(
    (value: Uint8Array): void => {
      const isValid = value.length !== 0;

      onChange && onChange({
        isValid,
        value
      });
      setIsValid(isValid);
    },
    [onChange]
  );

  if (isDisabled) {
    return (
      <Bytes
        className={className}
        defaultValue={defaultValue}
        isError={isError || !isValid}
        label={label}
        onEnter={onEnter}
        onEscape={onEscape}
        type={type}
        withLabel={withLabel}
      />
    );
  }

  return (
    <BytesFile
      className={className}
      defaultValue={defaultValue}
      isError={isError || !isValid}
      label={label}
      onChange={_onChange}
      withLabel={withLabel}
    />
  );
}

export default React.memo(Code);
