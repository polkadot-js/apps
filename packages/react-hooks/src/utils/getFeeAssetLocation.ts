// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { AnyNumber } from '@polkadot/types-codec/types';
import type { AssetInfoComplete } from '../types.js';

export const getFeeAssetLocation = (api: ApiPromise, feeAsset: AssetInfoComplete | null): AnyNumber | object | undefined => {
  if (!feeAsset?.id) {
    return undefined;
  }

  const metadata = api.registry.metadata;

  const palletIndex = metadata.pallets.filter((a) => a.name.toString() === 'Assets')[0].index.toString();

  // FIX ME: Might have to fix it later as it may not be applicable for all chains
  const palletInstance = { PalletInstance: palletIndex };
  const generalIndex = { GeneralIndex: feeAsset.id };

  return {
    interior: { X2: [palletInstance, generalIndex] },
    parents: 0
  };
};
