// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BaseProps, Size } from '../types';

import React, { useEffect, useState } from 'react';
import { Compact } from '@polkadot/types';
import { Input } from '@polkadot/react-components';
import { hexToU8a, isHex, u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import Bare from './Bare';

interface Props extends BaseProps {
  asHex?: boolean;
  children?: React.ReactNode;
  length?: number;
  size?: Size;
  validate?: (u8a: Uint8Array) => boolean;
  withLength?: boolean;
}

const defaultValidate = (): boolean =>
  true;

function convertInput (value: string): [boolean, Uint8Array] {
  // try hex conversion
  try {
    return [true, hexToU8a(value)];
  } catch (error) {
    // we continue...
  }

  // maybe it is an ss58?
  try {
    return [true, decodeAddress(value)];
  } catch (error) {
    // we continue
  }

  return [value === '0x', new Uint8Array([])];
}

export default function BaseBytes ({ asHex, children, className, defaultValue: { value }, isDisabled, isError, label, length = -1, onChange, onEnter, size = 'full', style, validate = defaultValidate, withLabel, withLength }: Props): React.ReactElement<Props> {
  const [isValid, setIsValid] = useState(false);

  useEffect((): void => {
    const [isValid, converted] = convertInput(value);

    setIsValid(
      isValid && validate(converted) && (
        length !== -1
          ? converted.length === length
          : true
      )
    );
  }, [length, value]);

  const _onChange = (hex: string): void => {
    let [isValid, value] = convertInput(hex);

    isValid = isValid && validate(value) && (
      length !== -1
        ? value.length === length
        : value.length !== 0
    );

    if (withLength && isValid) {
      value = Compact.addLengthPrefix(value);
    }

    onChange && onChange({
      isValid,
      value: asHex
        ? u8aToHex(value)
        : value
    });

    setIsValid(isValid);
  };

  const defaultValue = value
    ? (
      isHex(value)
        ? value
        : u8aToHex(value as Uint8Array, isDisabled ? 256 : -1)
    )
    : undefined;

  return (
    <Bare
      className={className}
      style={style}
    >
      <Input
        className={size}
        defaultValue={defaultValue}
        isAction={!!children}
        isDisabled={isDisabled}
        isError={isError || !isValid}
        label={label}
        onChange={_onChange}
        onEnter={onEnter}
        placeholder='0x...'
        type='text'
        withEllipsis
        withLabel={withLabel}
      >
        {children}
      </Input>
    </Bare>
  );
}
