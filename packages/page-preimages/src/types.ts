// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes } from '@polkadot/types';
import type { Call } from '@polkadot/types/interfaces';
import type { PalletPreimageRequestStatus } from '@polkadot/types/lookup';
import type { Registry } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';

export interface Preimage {
  deposit?: {
    amount: BN;
    who: string;
  };
  count: number;
  bytes: Bytes | null;
  proposal: Call | null;
  proposalError: string | null;
  proposalHash: HexString;
  proposalLength: BN;
  proposalWarning: string | null;
  registry: Registry;
  status: PalletPreimageRequestStatus | null;
}
