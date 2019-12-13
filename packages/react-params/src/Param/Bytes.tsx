// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';
import { Compact } from '@polkadot/types';
import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import BaseBytes from './BaseBytes';
import File from './File';

export default function Bytes ({ className, defaultValue, isDisabled, isError, label, name, onChange, onEnter, onEscape, style, type, withLabel }: Props): React.ReactElement<Props> {
  const [isFileDrop, toggleFile] = useToggle();

  const _onChangeFile = (value: Uint8Array): void => {
    onChange && onChange({
      isValid: value.length !== 0,
      value: Compact.addLengthPrefix(value)
    });
  };

  return !isDisabled && isFileDrop
    ? (
      <File
        className={className}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={_onChangeFile}
        style={style}
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
        style={style}
        type={type}
        withLabel={withLabel}
        withLength
      >
        {!isDisabled && (
          <Button
            icon='file'
            onClick={toggleFile}
          />
        )}
      </BaseBytes>
    );
}
