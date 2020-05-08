// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React, { useCallback } from 'react';
import { Input } from '@polkadot/react-components';

import Bare from './Bare';

function Raw ({ className, defaultValue: { value }, isDisabled, isError, label, onChange, onEnter, onEscape, style, withLabel }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (value: string): void => {
      const isValid = value.length !== 0;

      onChange && onChange({
        isValid,
        value
      });
    },
    [onChange]
  );

  const defaultValue = value
    ? (value.toHex ? value.toHex() : value)
    : '';

  return (
    <Bare
      className={className}
      style={style}
    >
      <Input
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        placeholder='Hex data'
        type='text'
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Raw);
