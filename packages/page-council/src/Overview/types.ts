// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveElectionsInfo } from '@polkadot/api-derive/types';
import type { SetIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';

export interface ComponentProps {
  electionsInfo?: DeriveElectionsInfo;
}

export interface VoterPosition {
  setIndex: SetIndex;
  globalIndex: BN;
}
