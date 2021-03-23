// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { SubmittableExtrinsic } from '@polkadot/api/types';

export interface InfoState {
  accountId: string;
  assetId: BN;
  createTx: SubmittableExtrinsic<'promise'>;
}

export interface MetadataState {
  metadataTx: SubmittableExtrinsic<'promise'>;
}

export interface TeamState {
  teamTx: SubmittableExtrinsic<'promise'> | null;
}
