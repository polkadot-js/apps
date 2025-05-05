// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types.js';

import React, { useCallback, useState } from 'react';

import { isWasm } from '@polkadot/util';

import Bytes from './Bytes.js';
import BytesFile from './File.js';

function Code ({ className = '', defaultValue, isDisabled, isError, label, onChange, onEnter, onEscape, registry, type, withLabel }: Props): React.ReactElement<Props> {
  const [isValid, setIsValid] = useState(false);

  const _onChange = useCallback(
    (value: Uint8Array): void => {
      const isValid = isWasm(value);

      onChange && onChange({ isValid, value });
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
        registry={registry}
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
