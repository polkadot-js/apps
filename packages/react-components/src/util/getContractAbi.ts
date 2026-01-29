// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Abi } from '@polkadot/api-contract';
import { statics } from '@polkadot/react-api/statics';

import { getAddressMeta } from './getAddressMeta.js';

export function getContractAbi (address: string | null): Abi | null {
  if (!address) {
    return null;
  }

  let abi: Abi | undefined;
  const meta = getAddressMeta(address, 'contract');

  try {
    const data = (meta.contract && JSON.parse(meta.contract.abi)) as string;

    abi = new Abi(data, statics.api.registry.getChainProperties());
  } catch (error) {
    console.error(error);
  }

  return abi || null;
}
