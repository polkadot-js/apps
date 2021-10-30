// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { PalletAssetsAssetDetails, PalletAssetsAssetMetadata } from '@polkadot/types/lookup';

export interface AssetInfo {
  details: PalletAssetsAssetDetails | null;
  id: BN;
  isAdminMe: boolean;
  isIssuerMe: boolean;
  isFreezerMe: boolean;
  isOwnerMe: boolean;
  key: string;
  metadata: PalletAssetsAssetMetadata | null;
}

export interface AssetInfoComplete extends AssetInfo {
  details: PalletAssetsAssetDetails;
  metadata: PalletAssetsAssetMetadata;
}
