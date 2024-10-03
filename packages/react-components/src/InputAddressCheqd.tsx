// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fromBech32 } from '@cosmjs/encoding';
import { bech32 } from 'bech32';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import BaseIdentityIcon from '@polkadot/react-identicon';

import Input from './Input';

interface Props {
  autoFocus?: boolean;
  children?: React.ReactNode;
  className?: string;
  defaultValue?: string | null;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  label?: React.ReactNode;
  noConvert?: boolean;
  onChange?: (address: string | null) => void;
  onEnter?: () => void;
  onEscape?: () => void;
}

export function getCheqdAddressError (address: string): string {
  try {
    const decoded = fromBech32(address);

    if (decoded.prefix !== 'cheqd') {
      throw new Error('Invalid prefix');
    }

    return null;
  } catch (err) {
    return err.message;
  }
}

export function isValidCheqdAddress (address: string) {
  try {
    const decoded = fromBech32(address);
    if (decoded.prefix !== 'cheqd') {
      return false;
    }

    if (decoded.data.length !== 20) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

function InputAddressCheqd ({ autoFocus, children, className = '', defaultValue, help, isDisabled, isError, isFull, label, noConvert, onChange, onEnter, onEscape }: Props): React.ReactElement<Props> {
  const [address, setAddress] = useState<string | null>(defaultValue || null);

  const _onChange = useCallback(
    (_address: string): void => {
      setAddress(_address);
      onChange && onChange(_address);
    },
    [noConvert, onChange]
  );

  return (
    <div className={className}>
      <Input
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        help={help}
        isDisabled={isDisabled}
        isError={!!(address && !isValidCheqdAddress(address))}
        isFull={isFull}
        label={label}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
      >
        {children}
      </Input>
      <BaseIdentityIcon
        className='ui--InputAddressCheqdIcon'
        size={32}
        theme={'ethereum'}
        value={address}
      />
    </div>
  );
}

export default React.memo(styled(InputAddressCheqd)`
  position: relative;

  .ui--InputAddressCheqdIcon {
    background: #eee;
    border: 1px solid #888;
    border-radius: 50%;
    left: 0.75rem;
    position: absolute;
    top: 1rem;
  }
`);
