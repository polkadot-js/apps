// Copyright 2017-2023 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes } from '@polkadot/types';
import type { Call } from '@polkadot/types/interfaces';
import type { PalletPreimageRequestStatus } from '@polkadot/types/lookup';
import type { Registry } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';

export interface PreimageDeposit {
  amount: BN;
  who: string;
}

export interface PreimageStatus {
  count: number;
  deposit?: PreimageDeposit;
  isCompleted: boolean;
  proposalHash: HexString;
  proposalLength?: BN;
  registry: Registry;
  status: PalletPreimageRequestStatus | null;
}

export interface PreimageBytes {
  bytes?: Bytes | null;
  proposal?: Call | null;
  proposalError?: string | null;
  proposalWarning?: string | null;
}

export interface Preimage extends PreimageBytes, PreimageStatus {
  // just the interfaces above
}
