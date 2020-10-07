// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { InkAbi } from '@polkadot/api-contract';
import { registry } from '@canvas-ui/react-api';

import getAddressMeta from './getAddressMeta';

export default function getContractAbi (address: string | null): InkAbi | null {
  if (!address) {
    return null;
  }

  let abi: InkAbi | undefined;
  const meta = getAddressMeta(address, 'contract');

  try {
    const data = meta.contract?.abi;

    abi = new InkAbi(registry, data);
  } catch (error) {
    // invalid address, maybe
  }

  return abi || null;
}
