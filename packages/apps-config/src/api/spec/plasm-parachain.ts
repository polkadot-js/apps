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
        Address: 'AccountId',
        LookupSource: 'AccountId',
        ChainId: {
          _enum: {
            RelayChain: null,
            Parachain: 'ParaId'
          }
        },
        XCurrencyId: {
          chain_id: 'ChainId',
          currency_id: 'Bytes'
        },
        CurrencyIdOf: 'CurrencyId',
        CurrencyId: {
          _enum: {
            Token: 'TokenSymbol'
          }
        },
        TokenSymbol: {
          _enum: ['ACA', 'AUSD', 'DOT', 'XBTC', 'LDOT', 'RENBTC', 'SDN', 'PLM']
        },
        AmountOf: 'Amount',
        Amount: 'i128'
      }
    }
  ]
};

export default definitions;
