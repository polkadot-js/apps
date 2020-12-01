// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import type { DeriveElectionsInfo } from '@polkadot/api-derive/types';
import type { SetIndex } from '@polkadot/types/interfaces';

export interface ComponentProps {
  electionsInfo?: DeriveElectionsInfo;
}

export interface VoterPosition {
  setIndex: SetIndex;
  globalIndex: BN;
}
