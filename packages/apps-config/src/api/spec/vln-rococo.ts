// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      minmax: [0, undefined],
      types: {
        Asset: {
          _enum: {
            Collateral: 'Collateral',
            Fiat: 'Fiat',
            Usdv: null
          }
        },
        Collateral: {
          _enum: [
            'Usdc'
          ]
        },
        Fiat: {
          _enum: [
            'Cop',
            'Vez'
          ]
        },
        CurrencyId: 'ForeignCurrencyId',
        OracleKey: 'Asset',
        OracleValue: 'FixedU128',
        CurrencyIdOf: 'ForeignCurrencyId',
        TimestampedValue: {
          value: 'OracleValue',
          timestamp: 'Moment'
        },
        TimestampedValueOf: 'TimestampedValue',
        OrderedSet: 'Vec<AccountId>',
        Share: 'Permill',
        XCurrencyId: {
          chain_id: 'ChainId',
          currency_id: 'Bytes'
        },
        ChainId: {
          _enum: {
            RelayChain: null,
            Parachain: 'ParaId'
          }
        },
        ForeignCurrencyId: {
          _enum: {
            Token: 'TokenSymbol'
          }
        },
        TokenSymbol: {
          _enum: [
            'ACA',
            'AUSD',
            'DOT',
            'USDV'
          ]
        }
      }
    }]
};

export default definitions;
