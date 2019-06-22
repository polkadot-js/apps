// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Abi } from '@polkadot/api-contract';

import getAddressMeta from './getAddressMeta';

export default function getContractAbi (address: string): Abi | null {
  let abi: Abi | undefined;
  const meta = getAddressMeta(address, 'contract');

  try {
    abi = meta.contract && new Abi(JSON.parse(meta.contract.abi));
  } catch (error) {
    // invalid address, maybe
  }

  return abi || null;
}
