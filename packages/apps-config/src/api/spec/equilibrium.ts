// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  Balance: 'u64',
  BalanceOf: 'Balance',
  BalancesAggregate: {
    total_issuance: 'Balance',
    total_debt: 'Balance'
  },
  BlockNumber: 'u64',
  ChainId: 'u8',
  Currency: {
    _enum: ['Unknown', 'Usd', 'EQ', 'Eth', 'Btc', 'Eos', 'Dot']
  },
  DataPoint: {
    price: 'u64',
    account_id: 'AccountId',
    block_number: 'BlockNumber',
    timestamp: 'u64'
  },
  DepositNonce: 'u64',
  FixedI64: 'i64',
  Keys: 'SessionKeys3',
  LookupSource: 'AccountId',
  OperationRequest: {
    account: 'AccountId',
    authority_index: 'AuthIndex',
    validators_len: 'u32',
    block_num: 'BlockNumber'
  },
  PricePayload: 'Data',
  PricePeriod: {
    _enum: ['Min', 'TenMin', 'Hour', 'FourHour', 'Day']
  },
  PricePoint: {
    block_number: 'BlockNumber',
    timestamp: 'u64',
    price: 'u64',
    data_points: 'Vec<DataPoint>'
  },
  ProposalStatus: {
    _enum: [
      'Initiated',
      'Approved',
      'Rejected'
    ]
  },
  ProposalVotes: {
    votes_for: 'Vec<AccountId>',
    votes_against: 'Vec<AccountId>',
    status: 'ProposalStatus',
    expiry: 'BlockNumber'
  },
  ReinitRequest: {
    account: 'AccountId',
    authority_index: 'AuthIndex',
    validators_len: 'u32',
    block_num: 'BlockNumber'
  },
  ResourceId: '[u8; 32]',
  SignedBalance: {
    _enum: {
      Positive: 'Balance',
      Negative: 'Balance'
    }
  },
  SubAccType: {
    _enum: ['Bailsman', 'Borrower', 'Lender']
  },
  TotalAggregates: {
    collateral: 'Balance',
    debt: 'Balance'
  },
  TransferReason: {
    _enum: [
      'Common',
      'InterestFee',
      'MarginCall',
      'BailsmenRedistribution',
      'TreasuryEqBuyout',
      'TreasuryBuyEq',
      'Subaccount'
    ]
  },
  UserGroup: {
    _enum: ['Unknown', 'Balances', 'Bailsmen', 'Borrowers', 'Lenders']
  },
  VestingInfo: {
    locked: 'Balance',
    perBlock: 'Balance',
    startingBlock: 'BlockNumber'
  }
};
