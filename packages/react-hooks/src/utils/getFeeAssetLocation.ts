// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { AnyNumber } from '@polkadot/types-codec/types';
import type { AssetInfoComplete } from '../types.js';

import { CHAINS_WITH_FEE_ASSET } from '../constants.js';

export const getFeeAssetLocation = (api: ApiPromise, feeAsset: AssetInfoComplete | null): AnyNumber | object | undefined => {
  const genesis = api.genesisHash.toHex();

  if (!CHAINS_WITH_FEE_ASSET.includes(genesis) || !feeAsset?.id) {
    return undefined;
  }

  switch (genesis) {
    case CHAINS_WITH_FEE_ASSET[0]: {
      const palletInstance = { PalletInstance: 50 };
      const generalIndex = { GeneralIndex: feeAsset.id };

      return {
        interior: { X2: [palletInstance, generalIndex] },
        parents: 0
      };
    }

    default:
      return undefined;
  }
};
