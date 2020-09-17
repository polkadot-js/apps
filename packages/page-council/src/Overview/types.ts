// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SetIndex } from '@polkadot/types/interfaces';
import { DeriveElectionsInfo } from '@polkadot/api-derive/types';

import BN from 'bn.js';

export interface ComponentProps {
  electionsInfo?: DeriveElectionsInfo;
}

export interface VoterPosition {
  setIndex: SetIndex;
  globalIndex: BN;
}
