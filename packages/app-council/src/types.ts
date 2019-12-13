// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, SetIndex } from '@polkadot/types/interfaces';
import { DerivedElectionsInfo } from '@polkadot/api-derive/types';

import BN from 'bn.js';

export interface ComponentProps {
  electionsInfo: DerivedElectionsInfo;
  allVotes?: Record<string, AccountId[]>;
}

export interface VoterPosition {
  setIndex: SetIndex;
  globalIndex: BN;
}
