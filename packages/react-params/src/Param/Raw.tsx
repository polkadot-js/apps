// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Codec } from '@polkadot/types/types';
import { Props } from '../types';

import React, { useCallback, useState } from 'react';
import { Input } from '@polkadot/react-components';

import Bare from './Bare';

function Raw ({ className = '', defaultValue: { value }, isDisabled, isError, label, onChange, onEnter, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const [isValid, setIsValid] = useState(false);

  const _onChange = useCallback(
    (value: string): void => {
      const isValid = value.length !== 0;

      onChange && onChange({
        isValid,
        value
      });
      setIsValid(isValid);
    },
    [onChange]
  );

  const defaultValue = value
    ? ((value as { toHex?: () => unknown }).toHex ? (value as Codec).toHex() : value)
    : '';

  return (
    <Bare className={className}>
      <Input
        className='full'
        defaultValue={defaultValue as string}
        isDisabled={isDisabled}
        isError={isError || !isValid}
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
