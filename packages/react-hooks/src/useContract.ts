// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StringOrNull } from '@canvas-ui/react-util/types';

import { useMemo } from 'react';
import { PromiseContract as Contract } from '@polkadot/api-contract';
import keyring from '@polkadot/ui-keyring';
import useApi from './useApi';

export default function useContract (address: StringOrNull): Contract | null {
  const { api } = useApi();

  return useMemo(
    (): Contract | null => {
      if (!address) {
        return null;
      }

      try {
        const pair = keyring.getAddress(address, 'contract');

        if (!pair) {
          throw new Error();
        }

        const data = pair?.meta.contract?.abi;

        return data
          ? new Contract(api, data, address)
          : null;
      } catch (error) {
        return null;
      }
    },
    [address, api]
  );
}
