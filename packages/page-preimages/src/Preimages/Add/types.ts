// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';

export interface HashState {
  encodedHash: HexString;
  encodedLength: number;
  encodedProposal?: HexString | null;
  extrinsic?: SubmittableExtrinsic<'promise'> | null;
  storageFee: BN;
}
