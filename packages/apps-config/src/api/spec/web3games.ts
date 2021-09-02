// Copyright 2017-2021 @polkadot/apps-config authors & contributors
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
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        TokenId: 'u64',
        InstanceId: 'u64',
        ExchangeId: 'u32',
        TokenSymbol: {
          _enum: {
            W3G: 0,
            DOT: 1,
            ACA: 2,
            AUSD: 3
          }
        },
        CurrencyId: {
          _enum: {
            Token: 'TokenSymbol'
          }
        },
        CurrencyIdOf: 'CurrencyId',
        CollectionId: 'u64',
        AssetId: '64'
      }
    }
  ]
};

export default definitions;
