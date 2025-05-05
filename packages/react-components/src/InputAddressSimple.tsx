// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import IdentityIcon from './IdentityIcon/index.js';
import { toAddress } from './util/index.js';
import Input from './Input.js';
import { styled } from './styled.js';

interface Props {
  autoFocus?: boolean;
  bytesLength?: 20 | 32;
  children?: React.ReactNode;
  className?: string;
  defaultValue?: string | null;
  forceIconType?: 'ethereum' | 'substrate';
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  label?: React.ReactNode;
  noConvert?: boolean;
  onChange?: (address: string | null) => void;
  onEnter?: () => void;
  onEscape?: () => void;
  placeholder?: string;
}

function InputAddressSimple ({ autoFocus, bytesLength, children, className = '', defaultValue, forceIconType, isDisabled, isError, isFull, label, noConvert, onChange, onEnter, onEscape, placeholder }: Props): React.ReactElement<Props> {
  const [address, setAddress] = useState<string | null>(defaultValue || null);

  const _onChange = useCallback(
    (_address: string): void => {
      const address = toAddress(_address, undefined, bytesLength) || null;
      const output = noConvert
        ? address
          ? _address
          : null
        : address;

      setAddress(output);
      onChange && onChange(output);
    },
    [bytesLength, noConvert, onChange]
  );

  return (
    <StyledDiv className={`${className} ui--InputAddressSimple`}>
      <Input
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError || !address}
        isFull={isFull}
        label={label}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        placeholder={placeholder}
      >
        {children}
      </Input>
      <IdentityIcon
        className='ui--InputAddressSimpleIcon'
        forceIconType={forceIconType}
        size={32}
        value={address}
      />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
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

export default React.memo(InputAddressSimple);
