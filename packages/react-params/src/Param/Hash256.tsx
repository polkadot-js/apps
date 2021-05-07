// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types';

import React, { useCallback, useState } from 'react';

import { Toggle } from '@polkadot/react-components';
import { u8aToHex } from '@polkadot/util';

import { useTranslation } from '../translate';
import BaseBytes from './BaseBytes';
import File from './File';

function Hash256 ({ className = '', defaultValue, isDisabled, isError, isInOption, label, name, onChange, onEnter, onEscape, registry, type, withLabel }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isFileDrop, setFileInput] = useState(false);
  const [placeholder, setPlaceholder] = useState<string | null>(null);

  const _onChangeFile = useCallback(
    (u8a: Uint8Array): void => {
      const value = registry.hash(u8a);

      setPlaceholder(u8aToHex(value));
      onChange && onChange({
        isValid: true,
        value
      });
    },
    [onChange, registry]
  );

  const _setFileInput = useCallback(
    (value: boolean): void => {
      setPlaceholder(null);
      setFileInput(value);
    },
    [setFileInput, setPlaceholder]
  );

  return (
    <div className={className}>
      {!isDisabled && isFileDrop
        ? (
          <File
            isDisabled={isDisabled}
            isError={isError}
            label={label}
            onChange={_onChangeFile}
            placeholder={placeholder || undefined}
            withLabel={withLabel}
          />
        )
        : (
          <BaseBytes
            asHex
            defaultValue={defaultValue}
            isDisabled={isDisabled}
            isError={isError}
            label={label}
            length={32}
            name={name}
            onChange={onChange}
            onEnter={onEnter}
            onEscape={onEscape}
            type={type}
            withCopy={isDisabled}
            withLabel={withLabel}
          />
        )}
      {!isDisabled && !isInOption && (
        <Toggle
          isOverlay
          label={t<string>('hash a file')}
          onChange={_setFileInput}
          value={isFileDrop}
        />
      )}
    </div>
  );
}

export default React.memo(Hash256);
