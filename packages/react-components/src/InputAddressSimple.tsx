// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import IdentityIcon from './IdentityIcon';
import Input from './Input';
import { toAddress } from './util';

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

function InputAddressSimple ({ autoFocus, children, className = '', defaultValue, help, isDisabled, isError, isFull, label, noConvert, onChange, onEnter, onEscape }: Props): React.ReactElement<Props> {
  const [address, setAddress] = useState<string | null>(defaultValue || null);

  const _onChange = useCallback(
    (_address: string): void => {
      const address = toAddress(_address) || null;
      const output = noConvert
        ? address
          ? _address
          : null
        : address;

      setAddress(output);
      onChange && onChange(output);
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
        isError={isError || !address}
        isFull={isFull}
        label={label}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
      >
        {children}
      </Input>
      <IdentityIcon
        className='ui--InputAddressSimpleIcon'
        size={32}
        value={address}
      />
    </div>
  );
}

export default React.memo(styled(InputAddressSimple)`
  position: relative;

  .ui--InputAddressSimpleIcon {
    background: #eee;
    border: 1px solid #888;
    border-radius: 50%;
    left: 0.75rem;
    position: absolute;
    top: 1rem;
  }
`);
