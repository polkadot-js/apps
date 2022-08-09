// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes } from '@polkadot/types';
import type { Call } from '@polkadot/types/interfaces';
import type { PalletPreimageRequestStatus } from '@polkadot/types/lookup';

export interface Preimage {
  count: number;
  bytes: Bytes | null;
  proposal: Call | null;
  status: PalletPreimageRequestStatus | null;
}
