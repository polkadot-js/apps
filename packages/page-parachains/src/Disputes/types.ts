// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';

export interface SessionInfo {
  paraValidators: string[];
  sessionCurrentIndex: BN;
  sessionIndexes: BN[];
  sessionValidators: string[];
}

export type DisputeRecord = Record<string, Record<HexString, string[]>>;

export interface DisputeInfo {
  disputes?: DisputeRecord;
  sessionInfo: SessionInfo;
}
