// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIMessage } from '@polkadot/api-contract/types';

import { PromiseContract as Contract } from '@polkadot/api-contract';

export default function getContractCallMessage (callContract: Contract | null, callMethodIndex = 0): ContractABIMessage | null {
  const message = callContract && callContract.abi.abi.contract.messages[callMethodIndex];

  return message || null;
}
