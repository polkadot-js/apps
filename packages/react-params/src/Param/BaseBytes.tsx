// Copyright 2017-2020 @polkadot/react-params authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { RawParam, RawParamOnChange, RawParamOnEnter, RawParamOnEscape, Size } from '../types';

import React, { useCallback, useState } from 'react';
import { Compact } from '@polkadot/types';
import { Input } from '@polkadot/react-components';
import { hexToU8a, isAscii, isHex, isU8a, u8aToHex, u8aToString } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import Bare from './Bare';

interface Props {
  asHex?: boolean;
  children?: React.ReactNode;
  className?: string;
  defaultValue: RawParam;
  isDisabled?: boolean;
  isError?: boolean;
  label?: React.ReactNode;
  length?: number;
  name?: string;
  onChange?: RawParamOnChange;
  onEnter?: RawParamOnEnter;
  onEscape?: RawParamOnEscape;
  size?: Size;
  type: TypeDef & { withOptionActive?: boolean };
  validate?: (u8a: Uint8Array) => boolean;
  withLabel?: boolean;
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

function BaseBytes ({ asHex, children, className = '', defaultValue: { value }, isDisabled, isError, label, length = -1, onChange, onEnter, onEscape, size = 'full', validate = defaultValidate, withLabel, withLength }: Props): React.ReactElement<Props> {
  const [defaultValue] = useState(
    value
      ? isDisabled && isU8a(value) && isAscii(value)
        ? u8aToString(value)
        : isHex(value)
          ? value
          : u8aToHex(value as Uint8Array, isDisabled ? 256 : -1)
      : undefined
  );
  const [isValid, setIsValid] = useState(false);

  const _onChange = useCallback(
    (hex: string): void => {
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
    },
    [asHex, length, onChange, validate, withLength]
  );

  return (
    <Bare className={className}>
      <Input
        className={size}
        defaultValue={defaultValue as string}
        isAction={!!children}
        isDisabled={isDisabled}
        isError={isError || !isValid}
        label={label}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
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

export default React.memo(BaseBytes);
