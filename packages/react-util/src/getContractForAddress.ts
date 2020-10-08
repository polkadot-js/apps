// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StringOrNull } from './types';

import { ApiPromise } from '@polkadot/api';
import { PromiseContract as Contract } from '@canvas-ui/api-contract';
import { getContractAbi } from '@canvas-ui/react-util';

export default function getContractForAddress (api: ApiPromise, address: StringOrNull): Contract | null {
  if (!address) {
    return null;
  } else {
    const abi = getContractAbi(address);

    return abi
      ? new Contract(api, abi, address)
      : null;
  }
}
