// Copyright 2017-2022 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types';

import React, { useCallback, useEffect, useState } from 'react';

import { Input } from '@polkadot/react-components';
import { compactAddLength, hexToU8a, u8aConcat } from '@polkadot/util';

import Bare from './Bare';

interface StateParam {
  isValid: boolean;
  u8a: Uint8Array;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function createParam (hex: string | String, ignoreLength = false): StateParam {
  let u8a;
  let isValid = false;

  try {
    u8a = hexToU8a(hex.toString());

    isValid = ignoreLength || u8a.length !== 0;
  } catch (error) {
    u8a = new Uint8Array([]);
  }

  return {
    isValid,
    u8a: compactAddLength(u8a)
  };
}

function KeyValue ({ className = '', isDisabled, label, onChange, onEnter, withLabel }: Props): React.ReactElement<Props> {
  const [, setIsValid] = useState(false);
  const [key, setKey] = useState<StateParam>(() => ({ isValid: false, u8a: new Uint8Array([]) }));
  const [value, setValue] = useState<StateParam>(() => ({ isValid: false, u8a: new Uint8Array([]) }));

  useEffect((): void => {
    const isValid = key.isValid && value.isValid;

    onChange && onChange({
      isValid,
      value: u8aConcat(
        key.u8a,
        value.u8a
      )
    });
    setIsValid(isValid);
  }, [key, onChange, value]);

  const _onChangeKey = useCallback(
    (key: string): void => setKey(createParam(key)),
    []
  );
  const _onChangeValue = useCallback(
    (value: string): void => setValue(createParam(value, true)),
    []
  );

  return (
    <Bare className={className}>
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

export default React.memo(KeyValue);
