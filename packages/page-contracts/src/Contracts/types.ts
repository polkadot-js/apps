// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';

export interface CallResult extends ContractCallOutcome {
  from: string;
  message: AbiMessage;
  params: any[];
  when: Date;
}

export interface ContractLink {
  blockHash: string;
  blockNumber: string;
  contractId: string;
}
