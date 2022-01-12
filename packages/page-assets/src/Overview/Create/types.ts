// Copyright 2017-2022 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export interface InfoState {
  accountId: string;
  assetDecimals: BN;
  assetId: BN;
  assetName: string;
  assetSymbol: string;
  minBalance: BN;
}

export interface TeamState {
  adminId: string;
  issuerId: string;
  freezerId: string;
}
