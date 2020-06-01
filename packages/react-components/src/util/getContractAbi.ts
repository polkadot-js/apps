// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIPre } from '@polkadot/api-contract/types';

import { Abi } from '@polkadot/api-contract';
import { registry } from '@polkadot/react-api';

import getAddressMeta from './getAddressMeta';

export default function getContractAbi (address: string | null): Abi | null {
  if (!address) {
    return null;
  }

  let abi: Abi | undefined;
  const meta = getAddressMeta(address, 'contract');

  try {
    const data = meta.contract && JSON.parse(meta.contract.abi) as ContractABIPre;

    abi = new Abi(registry, data as ContractABIPre);
  } catch (error) {
    // invalid address, maybe
  }

  return abi || null;
}
