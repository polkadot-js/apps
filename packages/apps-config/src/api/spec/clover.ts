// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        Amount: 'i128',
        Keys: 'SessionKeys4',
        AmountOf: 'Amount',
        Balance: 'u128',
        Rate: 'FixedU128',
        Ratio: 'FixedU128',
        EcdsaSignature: '[u8; 65]',
        EvmAddress: 'H160',
        EthereumTxHash: 'H256',
        BridgeNetworks: {
          _enum: ['BSC', 'Ethereum', 'CloverPara']
        }
      }
    }
  ]
};

export default definitions;
