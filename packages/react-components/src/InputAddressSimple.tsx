// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { resolveDomainToAddress } from '@azns/resolver-core';
import React, { useCallback, useState } from 'react';

import { systemNameToChainId, useApi } from '@polkadot/react-hooks';

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

  const { api, systemChain } = useApi();

  const _prepareInput = useCallback(
    async (input: string): Promise<string | null> => {
      const formattedAddress = toAddress(input, undefined, bytesLength) || null;

      if (formattedAddress) {
        return noConvert ? input : formattedAddress;
      }

      const chainId = systemNameToChainId.get(systemChain);

      if (!chainId) {
        return null;
      }

      const { address: resolvedAddress } = await resolveDomainToAddress(input, { chainId, customApi: api });

      return resolvedAddress || null;
    },
    [api, bytesLength, noConvert, systemChain]
  );

  const _onChange = useCallback(
    (_address: string): void => {
      _prepareInput(_address).catch(() => null).then((output) => {
        setAddress(output);
        onChange && onChange(output);
      }).catch(console.error);
    },
    [_prepareInput, onChange]
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
