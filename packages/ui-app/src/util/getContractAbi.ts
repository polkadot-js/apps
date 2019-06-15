// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Abi } from '@polkadot/api-contract';
import keyring from '@polkadot/ui-keyring';

export default function getContractAbi (address: string): Abi | null {
  let pair;

  try {
    pair = keyring.getContract(address);
  } catch (error) {
    // all-ok, we have empty fallbacks
  }

  return (
    pair &&
    pair.isValid &&
    pair.meta.contract &&
    new Abi(JSON.parse(pair.meta.contract.abi))
  ) || null;
}
