// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
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
};
