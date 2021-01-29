// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */
export default {
  Amount: 'i128',
  AmountOf: 'Amount',
  Address: 'AccountId',
  BalanceInfo: {
    amount: 'Balance',
    assetId: 'AssetId'
  },
  CurrencyId: 'AssetId',
  CurrencyIdOf: 'AssetId',
  Intention: {
    who: 'AccountId',
    asset_sell: 'AssetId',
    asset_buy: 'AssetId',
    amount: 'Balance',
    discount: 'bool',
    sell_or_buy: 'IntentionType'
  },
  IntentionId: 'u128',
  IntentionType: {
    _enum: [
      'SELL',
      'BUY'
    ]
  },
  LookupSource: 'AccountId',
  Price: 'Balance'
};
