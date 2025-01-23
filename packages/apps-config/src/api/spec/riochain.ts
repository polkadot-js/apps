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
        LookupSource: 'IndicesLookupSource',
        Address: 'LookupSource',
        Amount: 'i128',
        AmountOf: 'Amount',
        CurrencyId: 'u32',
        CurrencyIdOf: 'CurrencyId',
        Price: 'FixedU128',
        OracleKey: 'CurrencyId',
        Chain:
        {
          _enum:
            ['Rio',
              'Bitcoin',
              'Litecoin',
              'Ethereum',
              'EOS',
              'Polkadot',
              'Kusama',
              'ChainX']
        },
        AssetInfo:
        {
          chain: 'Chain',
          symbol: 'Text',
          name: 'Text',
          decimals: 'u8',
          desc: 'Text'
        },
        FeeExchangeV1: { max_payment: 'Compact<Balance>' },
        FeeExchange: { _enum: { V1: 'Compact<FeeExchangeV1>' } },
        Restriction:
        {
          _enum:
            ['Transferable',
              'Depositable',
              'Withdrawable',
              'Slashable',
              'Reservable',
              'Unreservable']
        },
        TxHash: 'H256',
        Deposit: { account_id: 'AccountId', amount: 'Balance' },
        Auths: { mask: 'u8' },
        Auth: { _enum: ['Register', 'Deposit', 'Withdraw', 'Sudo'] },
        WithdrawState:
        {
          _enum:
          {
            Pending: null,
            Cancelled: null,
            Rejected: null,
            Approved: null,
            Success: 'TxHash',
            ReBroadcasted: 'TxHash'
          }
        },
        ChainAddress: 'Bytes',
        Memo: 'Text',
        WithdrawInfo:
        {
          currency_id: 'CurrencyId',
          who: 'AccountId',
          value: 'Balance',
          addr: 'ChainAddress',
          memo: 'Text'
        },
        WithdrawItem:
        {
          currency_id: 'CurrencyId',
          applicant: 'AccountId',
          value: 'Balance',
          addr: 'ChainAddress',
          memo: 'Text',
          state: 'WithdrawState'
        },
        DepositAddrInfo: { _enum: { Bip32: 'Bip32', Create2: 'Create2' } },
        Bip32: { x_pub: 'Text', path: 'Text' },
        Create2:
        {
          creator_address: 'Vec<u8>',
          implementation_address: 'Vec<u8>',
          vault_address: 'Vec<u8>'
        }
      }
    }
  ]
};

export default definitions;
