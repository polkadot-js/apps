// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types.js';

import React, { useCallback, useState } from 'react';

import { Toggle } from '@polkadot/react-components';
import { compactAddLength } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import BaseBytes from './BaseBytes.js';
import File from './File.js';

function Bytes ({ className = '', defaultValue, isDisabled, isError, label, name, onChange, onEnter, onEscape, type, withLabel, withLength = true }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(false);
  const [isFileDrop, setFileInput] = useState(false);

  const _onChangeFile = useCallback(
    (value: Uint8Array): void => {
      const isValid = value.length !== 0;

      onChange && onChange({
        isValid,
        value: compactAddLength(value)
      });

      setIsValid(isValid);
    },
    [onChange]
  );

  const toggleLabel = !isDisabled && (
    <Toggle
      label={t('file upload')}
      onChange={setFileInput}
      value={isFileDrop}
    />
  );

  return (
    <div className={`${className} --relative`}>
      {!isDisabled && isFileDrop
        ? (
          <File
            isDisabled={isDisabled}
            isError={isError || !isValid}
            label={label}
            labelExtra={toggleLabel}
            onChange={_onChangeFile}
            withLabel={withLabel}
          />
        )
        : (
          <BaseBytes
            defaultValue={defaultValue}
            isDisabled={isDisabled}
            isError={isError}
            label={label}
            labelExtra={toggleLabel}
            length={-1}
            name={name}
            onChange={onChange}
            onEnter={onEnter}
            onEscape={onEscape}
            type={type}
            withLabel={withLabel}
            withLength={withLength}
          />
        )
      }
      {}
    </div>
  );
}

export default React.memo(Bytes);
