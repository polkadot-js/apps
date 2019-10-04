// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Abi } from '@polkadot/api-contract';

import getAddressMeta from './getAddressMeta';

export default function getContractAbi (address: string | null): Abi | null {
  if (!address) {
    return null;
  }

  let abi: Abi | undefined;
  const meta = getAddressMeta(address, 'contract');

  try {
    const data = meta.contract && JSON.parse(meta.contract.abi);
    abi = new Abi(data);
  } catch (error) {
    // invalid address, maybe
  }

  return abi || null;
}
