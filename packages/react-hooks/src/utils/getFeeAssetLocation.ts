// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { AnyNumber } from '@polkadot/types-codec/types';
import type { AssetInfoComplete } from '../types.js';

import { ALLOWED_CHAINS } from '../constants.js';

export const getFeeAssetLocation = (api: ApiPromise, selectedFeeAsset: AssetInfoComplete | null): AnyNumber | object | undefined => {
  const genesis = api.genesisHash.toHex();

  if (!ALLOWED_CHAINS.includes(genesis) || !selectedFeeAsset) {
    return undefined;
  }

  switch (genesis) {
    case ALLOWED_CHAINS[0]: {
      return {
        interior: {
          X2: [
            {
              PalletInstance: 50
            },
            {
              GeneralIndex: selectedFeeAsset.id.toString()
            }
          ]
        },
        parents: 0
      };
    }

    default:
      return undefined;
  }
};
