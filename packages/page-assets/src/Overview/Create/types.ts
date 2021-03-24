// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { SubmittableExtrinsic } from '@polkadot/api/types';

export interface InfoState {
  accountId: string;
  assetId: BN;
  createTx: SubmittableExtrinsic<'promise'>;
  minBalance: BN;
}

export interface MetadataState {
  assetDecimals: BN;
  assetName: string;
  assetSymbol: string;
  metadataTx: SubmittableExtrinsic<'promise'>;
}

export interface TeamState {
  adminId: string;
  issuerId: string;
  freezerId: string;
  teamTx: SubmittableExtrinsic<'promise'> | null;
}
