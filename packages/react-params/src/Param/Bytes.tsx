// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React, { useCallback, useState } from 'react';
import { Compact } from '@polkadot/types';
import { Button } from '@polkadot/react-components';

import BaseBytes from './BaseBytes';
import File from './File';

function Bytes ({ className = '', defaultValue, isDisabled, isError, label, name, onChange, onEnter, onEscape, type, withLabel }: Props): React.ReactElement<Props> {
  const [isValid, setIsValid] = useState(false);
  const [isFileDrop, setIsFileDrop] = useState(false);

  const _toggleFile = useCallback(
    (): void => setIsFileDrop(true),
    []
  );

  const _onChangeFile = useCallback(
    (value: Uint8Array): void => {
      const isValid = value.length !== 0;

      onChange && onChange({
        isValid,
        value: Compact.addLengthPrefix(value)
      });

      setIsValid(isValid);
    },
    [onChange]
  );

  return !isDisabled && isFileDrop
    ? (
      <File
        className={className}
        isDisabled={isDisabled}
        isError={isError || !isValid}
        label={label}
        onChange={_onChangeFile}
        withLabel={withLabel}
      />
    )
    : (
      <BaseBytes
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
        withLabel={withLabel}
        withLength
      >
        {!isDisabled && (
          <Button
            icon='file'
            onClick={_toggleFile}
          />
        )}
      </BaseBytes>
    );
}

export default React.memo(Bytes);
