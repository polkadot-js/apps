// Copyright 2017-2022 @polkadot/apps-config authors & contributors
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
            Network: 'NetworkAsset',
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
        CurrencyId: 'NetworkAsset',
        OracleKey: 'Asset',
        OracleValue: 'FixedU128',
        CurrencyIdOf: 'NetworkAsset',
        Amount: 'i64',
        AmountOf: 'Amount',
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
        NetworkAsset: {
          _enum: [
            'ACA',
            'AUSD',
            'DOT'
          ]
        },
        BaseAsset: 'CurrencyId',
        AssetPair: {
          base: 'BaseAsset',
          quote: 'CurrencyId'
        },
        PaymentMethod: {
          _enum: [
            'BankX',
            'BankY'
          ]
        },
        RatePremiumType: 'FixedU128',
        SwapKind: {
          _enum: {
            In: 'SwapIn',
            Out: 'SwapOut'
          }
        },
        SwapIn: {
          _enum: {
            Created: null,
            Accepted: 'Vec<u8>',
            Rejected: 'Vec<u8>',
            Confirmed: 'Vec<u8>',
            Expired: null,
            Completed: null
          }
        },
        SwapOut: {
          _enum: {
            Created: null,
            Accepted: null,
            Rejected: 'Vec<u8>',
            Confirmed: 'Vec<u8>',
            Expired: null,
            Completed: null
          }
        },
        PairPrice: {
          pair: 'AssetPair',
          price: 'FixedU128'
        },
        Swap: {
          human: 'AccountId',
          kind: 'SwapKind',
          price: 'PairPrice',
          amount: 'FixedU128'
        },
        RateDetail: {
          rate: 'FixedU128'
        }
      }
    }]
};

export default definitions;
