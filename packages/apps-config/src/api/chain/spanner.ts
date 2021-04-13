// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  AssetId: 'u32',
  Weight: 'u64',
  Amount: 'i128',
  AmountOf: 'Amount',
  TokenSymbol: {
    _enum: ['BOLT', 'WUSD', 'BBOT', 'NCAT', 'PLKT']
  },
  CurrencyId: {
    _enum: {
      Token: 'TokenSymbol',
      DexShare: '(TokenSymbol, TokenSymbol)'
    }
  },
  CurrencyIdOf: 'CurrencyId',
  TravelCabinIndex: 'u32',
  TravelCabinInventoryIndex: 'u16',
  DpoIndex: 'u32',
  TravelCabinInfo: {
    name: 'Text',
    creator: 'AccountId',
    token_id: 'CurrencyId',
    index: 'TravelCabinIndex',
    deposit_amount: 'Balance',
    bonus_total: 'Balance',
    yield_total: 'Balance',
    maturity: 'BlockNumber'
  },
  TravelCabinBuyerInfo: {
    buyer: 'Buyer',
    purchase_blk: 'BlockNumber',
    yield_withdrawn: 'Balance',
    fare_withdrawn: 'bool',
    blk_of_last_withdraw: 'BlockNumber'
  },
  MilestoneRewardInfo: {
    token_id: 'CurrencyId',
    deposited: 'Balance',
    milestones: 'Vec<(Balance, Balance)>'
  },
  DpoState: {
    _enum: ['CREATED', 'ACTIVE', 'RUNNING', 'FAILED', 'COMPLETED']
  },
  Target: {
    _enum: {
      Dpo: '(DpoIndex, u8)',
      TravelCabin: 'TravelCabinIndex'
    }
  },
  Buyer: {
    _enum: {
      Dpo: 'DpoIndex',
      Passenger: 'AccountId',
      InvalidBuyer: null
    }
  },
  DpoInfo: {
    index: 'DpoIndex',
    name: 'Text',
    token_id: 'CurrencyId',
    manager: 'AccountId',
    target: 'Target',
    target_maturity: 'BlockNumber',
    target_amount: 'Balance',
    target_yield_estimate: 'Balance',
    target_bonus_estimate: 'Balance',
    amount_per_seat: 'Balance',
    empty_seats: 'u8',
    fifo: 'Vec<Buyer>',
    vault_deposit: 'Balance',
    vault_withdraw: 'Balance',
    vault_yield: 'Balance',
    vault_bonus: 'Balance',
    total_yield_received: 'Balance',
    total_bonus_received: 'Balance',
    total_milestone_received: 'Balance',
    blk_of_last_yield: 'Option<BlockNumber>',
    blk_of_dpo_filled: 'Option<BlockNumber>',
    expiry_blk: 'BlockNumber',
    state: 'DpoState',
    referrer: 'Option<AccountId>',
    fare_withdrawn: 'bool',
    direct_referral_rate: 'u32',
    fee: 'u32',
    fee_slashed: 'bool'
  },
  DpoMemberInfo: {
    buyer: 'Buyer',
    number_of_seats: 'u8',
    referrer: 'Referrer'
  },
  Referrer: {
    _enum: {
      None: null,
      MemberOfDpo: 'Buyer',
      External: '(AccountId, Buyer)'
    }
  },
  PaymentType: {
    _enum: ['Deposit', 'Bonus', 'MilestoneReward', 'Yield', 'UnusedFund', 'WithdrawOnCompletion', 'WithdrawOnFailure']
  },
  PoolId: {
    _enum: {
      DexYieldFarming: 'CurrencyId'
    }
  },
  PoolInfo: {
    total_shares: 'Balance',
    total_rewards: 'Balance',
    total_withdrawn_rewards: 'Balance'
  },
  Price: 'FixedU128',
  ExchangeRate: 'FixedU128',
  Ratio: 'FixedU128',
  Rate: 'FixedU128',
  TradingPair: '(CurrencyId, CurrencyId)',
  TradingPairStatus: {
    _enum: {
      NotEnabled: null,
      Provisioning: 'TradingPairProvisionParameters',
      Enabled: null
    }
  },
  TradingPairProvisionParameters: {
    min_contribution: '(Balance, Balance)',
    target_provision: '(Balance, Balance)',
    accumulated_provision: '(Balance, Balance)',
    not_before: 'BlockNumber'
  }
};
