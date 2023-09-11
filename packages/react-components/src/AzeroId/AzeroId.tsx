// Copyright 2017-2023 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SupportedChainId } from '@azns/resolver-core';
import React from 'react';

import { systemNameToChainId, useAddressToDomain, useApi } from '@polkadot/react-hooks';

import { AzeroIdInteractiveDomain, AzeroIdPlaceholder, AzeroIdRegisterLink } from './Atoms.js';

type WrappedAzeroIdProps = {
  address?: string;
  className?: string;
  isRegisterLinkShown?: boolean;
};

type AzeroIdProps = WrappedAzeroIdProps & {
  chainId: SupportedChainId.AlephZero | SupportedChainId.AlephZeroTestnet,
};

const AzeroId = ({ address, chainId, className, isRegisterLinkShown }: AzeroIdProps) => {
  const { hasError, isLoading, primaryDomain } = useAddressToDomain(address);

  if (primaryDomain) {
    return (
      <AzeroIdInteractiveDomain
        chainId={chainId}
        className={className}
        domain={primaryDomain}
      />
    );
  }

  if (!isRegisterLinkShown) {
    return null;
  }

  if (isLoading || hasError) {
    return <AzeroIdPlaceholder />;
  }

  return (
    <AzeroIdRegisterLink
      chainId={chainId}
      className={className}
    />
  );
};

const WrappedAzeroId = ({ address, className, isRegisterLinkShown = true }: WrappedAzeroIdProps) => {
  const { systemChain } = useApi();

  const chainId = systemNameToChainId.get(systemChain);

  if (!chainId) {
    return null;
  }

  return (
    <AzeroId
      address={address}
      chainId={chainId}
      className={className}
      isRegisterLinkShown={isRegisterLinkShown}
    />
  );
};

export default WrappedAzeroId;
