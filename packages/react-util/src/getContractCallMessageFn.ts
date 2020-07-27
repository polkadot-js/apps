// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIFn } from '@polkadot/api-contract/types';

import { PromiseContract as Contract } from '@polkadot/api-contract';

export default function getContractMethodFn (callContract: Contract | null, callMethodIndex: number | null): ContractABIFn | null {
  const fn = callContract && callContract.abi && callMethodIndex !== null && callContract.abi.messages[callMethodIndex];

  return fn || null;
}
