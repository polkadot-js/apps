// Copyright 2017-2023 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { resolveAddressToDomain } from '@azns/resolver-core';
import React, { ComponentType, useContext, useEffect, useState } from 'react';

import { ApiCtx } from '@polkadot/react-api';
import { systemNameToChainId } from '@polkadot/react-hooks';
import { KeyringOptions, KeyringSectionOptions } from '@polkadot/ui-keyring/options/types';

type RequiredProps = {
  options?: KeyringSectionOptions | null;
  optionsAll?: KeyringOptions;
};

const wrapWithAddressResolver = <Props extends RequiredProps>(Component: ComponentType<Props>): ComponentType<Omit<Props, 'addressToDomain'>> => {
  const Wrapped = (props: Props) => {
    const [addressToDomain, setAddressToDomain] = useState<Record<string, string | null | undefined>>({});
    const { api, systemChain } = useContext(ApiCtx);

    const { options, optionsAll } = props;

    useEffect(() => {
      const chainId = systemNameToChainId.get(systemChain);

      if (!chainId) {
        return;
      }

      const allAddressesWithDuplicates = [...(options || []), ...(optionsAll?.allPlus || [])].flatMap(({ value }) => value ? [value] : []);
      const allAddresses = [...new Set(allAddressesWithDuplicates)];

      const unresolvedAddresses = allAddresses.filter((address) => !(address in addressToDomain));
      const domainPromises = unresolvedAddresses.map((address) => resolveAddressToDomain(address, { chainId, customApi: api }));

      if (!domainPromises.length) {
        return;
      }

      Promise.all(domainPromises).then(
        (results) => {
          const addressDomainTuples = results.flatMap(
            ({ error, primaryDomain }, index) => error
              ? []
              : [[unresolvedAddresses[index], primaryDomain] as [string, string | undefined | null]]
          );

          setAddressToDomain({ ...addressToDomain, ...Object.fromEntries(addressDomainTuples) });
        }
      ).catch(console.error);
    }, [addressToDomain, api, options, optionsAll, systemChain]);

    return (
      <Component
        {...props}
        addressToDomain={addressToDomain}
      />
    );
  };

  return Wrapped as ComponentType<Omit<Props, 'addressToDomain'>>;
};

export default wrapWithAddressResolver;
