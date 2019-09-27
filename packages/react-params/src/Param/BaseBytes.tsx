// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BaseProps, Size } from '../types';

import React from 'react';
import { Compact } from '@polkadot/types';
import { Input } from '@polkadot/react-components';
import { hexToU8a, isHex, u8aToHex } from '@polkadot/util';

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

function onChange ({ asHex, length = -1, onChange, validate = defaultValidate, withLength }: Props): (_: string) => void {
  return function (hex: string): void {
    let value: Uint8Array;
    let isValid = true;

    try {
      value = hexToU8a(hex);
    } catch (error) {
      value = new Uint8Array([]);
      isValid = false;
    }

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
  };
}

export default function BaseBytes (props: Props): React.ReactElement<Props> {
  const { children, className, defaultValue: { value }, isDisabled, isError, label, onEnter, size = 'full', style, withLabel } = props;
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
        isError={isError}
        label={label}
        onChange={onChange(props)}
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
