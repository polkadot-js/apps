// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetDetails, AssetId, AssetMetadata } from '@polkadot/types/interfaces';

export interface AssetInfo {
  details: AssetDetails | null;
  id: AssetId;
  isAdmin: boolean;
  isOwner: boolean;
  isIssuer: boolean;
  isFreezer: boolean;
  key: string;
  metadata: AssetMetadata | null;
}
