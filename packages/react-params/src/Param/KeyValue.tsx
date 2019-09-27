// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React, { useEffect, useState } from 'react';
import { Compact } from '@polkadot/types';
import { Input } from '@polkadot/react-components';
import { hexToU8a, u8aConcat } from '@polkadot/util';

import Bare from './Bare';

interface StateParam {
  isValid: boolean;
  u8a: Uint8Array;
}

export function createParam (hex: string, length = -1): StateParam {
  let u8a;

  try {
    u8a = hexToU8a(hex);
  } catch (error) {
    u8a = new Uint8Array([]);
  }

  const isValid = length !== -1
    ? u8a.length === length
    : u8a.length !== 0;

  return {
    isValid,
    u8a: Compact.addLengthPrefix(u8a)
  };
}

export default function KeyValue ({ className, isDisabled, label, onChange, onEnter, style, withLabel }: Props): React.ReactElement<Props> {
  const [key, setKey] = useState<StateParam>({ isValid: false, u8a: new Uint8Array([]) });
  const [value, setValue] = useState<StateParam>({ isValid: false, u8a: new Uint8Array([]) });

  useEffect((): void => {
    onChange && onChange({
      isValid: key.isValid && value.isValid,
      value: u8aConcat(
        key.u8a,
        value.u8a
      )
    });
  }, [key, value]);

  const _onChangeKey = (key: string): void => setKey(createParam(key));
  const _onChangeValue = (value: string): void => setValue(createParam(value));

  return (
    <Bare
      className={className}
      style={style}
    >
      <Input
        className='medium'
        isDisabled={isDisabled}
        isError={!key.isValid}
        label={label}
        onChange={_onChangeKey}
        placeholder='0x...'
        type='text'
        withLabel={withLabel}
      />
      <Input
        className='medium'
        isDisabled={isDisabled}
        isError={!value.isValid}
        onChange={_onChangeValue}
        onEnter={onEnter}
        placeholder='0x...'
        type='text'
        withLabel={withLabel}
      />
    </Bare>
  );
}
