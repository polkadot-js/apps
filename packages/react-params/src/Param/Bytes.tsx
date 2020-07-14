// Copyright 2017-2020 @polkadot/react-params authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Compact } from '@polkadot/types';
import { Toggle } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import BaseBytes from './BaseBytes';
import File from './File';

function Bytes ({ className = '', defaultValue, isDisabled, isError, label, name, onChange, onEnter, onEscape, type, withLabel }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(false);
  const [isFileDrop, setFileInput] = useState(false);

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

  return (
    <div className={className}>
      {!isDisabled && isFileDrop
        ? (
          <File
            isDisabled={isDisabled}
            isError={isError || !isValid}
            label={label}
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
            length={-1}
            name={name}
            onChange={onChange}
            onEnter={onEnter}
            onEscape={onEscape}
            type={type}
            withLabel={withLabel}
            withLength
          />
        )
      }
      {!isDisabled && (
        <Toggle
          className='ui--Param-Bytes-toggle'
          label={t<string>('file upload')}
          onChange={setFileInput}
          value={isFileDrop}
        />
      )}
    </div>
  );
}

export default React.memo(styled(Bytes)`
  position: relative;

  > .ui--Param-Bytes-toggle {
    top: 1.375rem;
    position: absolute;
    right: 3.5rem;
  }
`);
