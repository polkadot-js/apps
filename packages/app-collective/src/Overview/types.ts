// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types';

import BN from 'bn.js';

export interface ElectionsInfo {
  members: [string, BlockNumber][];
  candidates: string[];
  candidateCount: BN;
  desiredSeats: BN;
  termDuration: BN;
  voteCount: BN;
}
