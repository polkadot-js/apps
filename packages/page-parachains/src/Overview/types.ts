// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, ParaValidatorIndex } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

export interface EventMapInfo {
  blockHash: string;
  blockNumber: BN;
  relayParent: string;
}

export interface ValidatorInfo {
  indexActive: ParaValidatorIndex;
  indexValidator: ParaValidatorIndex;
  validatorId: AccountId;
}
