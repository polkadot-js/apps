// Copyright 2017-2022 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TypeDef } from '@polkadot/types/types';
import type { RawParam, RawParamOnChange, RawParamOnEnter, RawParamOnEscape, Size } from '../types';

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { CopyButton, IdentityIcon, Input } from '@polkadot/react-components';
import { compactAddLength, hexToU8a, isAscii, isHex, isU8a, stringToU8a, u8aToHex, u8aToString } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { useTranslation } from '../translate';
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
  withCopy?: boolean;
  withLabel?: boolean;
  withLength?: boolean;
}

interface Validity {
  isAddress: boolean;
  isValid: boolean;
  lastValue?: Uint8Array;
}

const defaultValidate = (): boolean =>
  true;

function convertInput (value: string): [boolean, boolean, Uint8Array] {
  if (value === '0x') {
    return [true, false, new Uint8Array([])];
  } else if (value.startsWith('0x')) {
    try {
      return [true, false, hexToU8a(value)];
    } catch (error) {
      return [false, false, new Uint8Array([])];
    }
  }

  // maybe it is an ss58?
  try {
    return [true, true, decodeAddress(value)];
  } catch (error) {
    // we continue
  }

  return isAscii(value)
    ? [true, false, stringToU8a(value)]
    : [value === '0x', false, new Uint8Array([])];
}

function BaseBytes ({ asHex, children, className = '', defaultValue: { value }, isDisabled, isError, label, length = -1, onChange, onEnter, onEscape, size = 'full', validate = defaultValidate, withCopy, withLabel, withLength }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [defaultValue] = useState(
    value
      ? isDisabled && isU8a(value) && isAscii(value)
        ? u8aToString(value)
        : isHex(value)
          ? value
          : u8aToHex(value as Uint8Array, isDisabled ? 256 : -1)
      : undefined
  );
  const [{ isAddress, isValid, lastValue }, setValidity] = useState<Validity>(() => ({ isAddress: false, isValid: false }));

  const _onChange = useCallback(
    (hex: string): void => {
      let [isValid, isAddress, value] = convertInput(hex);

      isValid = isValid && validate(value) && (
        length !== -1
          ? value.length === length
          : (value.length !== 0 || hex === '0x')
      );

      if (withLength && isValid) {
        value = compactAddLength(value);
      }

      onChange && onChange({
        isValid,
        value: asHex
          ? u8aToHex(value)
          : value
      });

      setValidity({ isAddress, isValid, lastValue: value });
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
        placeholder={t<string>('0x prefixed hex, e.g. 0x1234 or ascii data')}
        type='text'
        withEllipsis
        withLabel={withLabel}
      >
        {children}
        {withCopy && (
          <CopyButton value={defaultValue} />
        )}
        {isAddress && (
          <IdentityIcon
            className='ui--InputAddressSimpleIcon'
            size={32}
            value={lastValue}
          />
        )}
      </Input>
    </Bare>
  );
}

export default React.memo(styled(BaseBytes)`
  .ui--InputAddressSimpleIcon {
    background: #eee;
    border: 1px solid #888;
    border-radius: 50%;
    left: -16px;
    position: absolute;
    top: 8px;
  }
`);
