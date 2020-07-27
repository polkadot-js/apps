// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIPre } from '@polkadot/api-contract/types';
import { StringOrNull } from '@canvas-ui/react-util/types';

import { useMemo } from 'react';
import { Abi, PromiseContract as Contract } from '@polkadot/api-contract';
import { registry } from '@canvas-ui/react-api';
import keyring from '@polkadot/ui-keyring';
import useApi from './useApi';

export default function useContract (address: StringOrNull): Contract | null {
  const { api } = useApi();

  return useMemo(
    (): Contract | null => {
      if (!address) {
        return null;
      }

      let abi: Abi | undefined;

      try {
        const pair = keyring.getAddress(address, 'contract');

        if (!pair) {
          throw new Error();
        }

        const data = pair?.meta.contract && JSON.parse(pair.meta.contract.abi) as ContractABIPre;

        abi = new Abi(registry, data as ContractABIPre);

        return abi
          ? new Contract(api, abi, address)
          : null;
      } catch (error) {
        return null;
      }
    },
    [address, api]
  );
}
