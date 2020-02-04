// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React, { useState } from 'react';
import styled from 'styled-components';

import addressToAddress from './util/toAddress';
import IdentityIcon from './IdentityIcon';
import Input from './Input';

interface Props extends BareProps {
  children?: React.ReactNode;
  defaultValue?: string | null;
  help?: React.ReactNode;
  isFull?: boolean;
  label?: React.ReactNode;
  onChange?: (address: string | null) => void;
  onEnter?: () => void;
  onEscape?: () => void;
}

function InputAddressSimple ({ children, className, defaultValue, help, isFull, label, onChange, onEnter, onEscape }: Props): React.ReactElement<Props> {
  const [address, setAddress] = useState<string | null>(defaultValue || null);

  const _onChange = (_address: string): void => {
    const address = addressToAddress(_address) || null;

    setAddress(address);

    onChange && onChange(address);
  };

  return (
    <div className={className}>
      <Input
        defaultValue={defaultValue}
        help={help}
        isError={!address}
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

export default styled(InputAddressSimple)`
  position: relative;

  .ui--InputAddressSimpleIcon {
    background: #eee;
    border: 1px solid #888;
    border-radius: 50%;
    left: 0.75rem;
    position: absolute;
    top: 1rem;
  }
`;
