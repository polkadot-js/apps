// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      minmax: [0, 104],
      types: {
        CallOf: 'Call',
        DispatchTime: {
          _enum: {
            At: 'BlockNumber',
            After: 'BlockNumber'
          }
        },
        ScheduleTaskIndex: 'u32',
        DelayedOrigin: {
          delay: 'BlockNumber',
          origin: 'PalletsOrigin'
        },
        AuthorityOrigin: 'DelayedOrigin',
        StorageValue: 'Vec<u8>',
        GraduallyUpdate: {
          key: 'StorageKey',
          targetValue: 'StorageValue',
          perBlock: 'StorageValue'
        },
        StorageKeyBytes: 'Vec<u8>',
        StorageValueBytes: 'Vec<u8>',
        RpcDataProviderId: 'Text',
        DataProviderId: 'u8',
        TimestampedValue: {
          value: 'OracleValue',
          timestamp: 'Moment'
        },
        TimestampedValueOf: 'TimestampedValue',
        OrderedSet: 'Vec<AccountId>',
        OrmlAccountData: {
          free: 'Balance',
          frozen: 'Balance',
          reserved: 'Balance'
        },
        OrmlBalanceLock: {
          amount: 'Balance',
          id: 'LockIdentifier'
        },
        AuctionInfo: {
          bid: 'Option<(AccountId, Balance)>',
          start: 'BlockNumber',
          end: 'Option<BlockNumber>'
        },
        DelayedDispatchTime: {
          _enum: {
            At: 'BlockNumber',
            After: 'BlockNumber'
          }
        },
        DispatchId: 'u32',
        Price: 'FixedU128',
        OrmlVestingSchedule: {
          start: 'BlockNumber',
          period: 'BlockNumber',
          periodCount: 'u32',
          perPeriod: 'Compact<Balance>'
        },
        VestingScheduleOf: 'OrmlVestingSchedule',
        PoolInfo: {
          total_shares: 'Balance',
          total_rewards: 'Balance',
          total_withdrawn_rewards: 'Balance'
        },
        Share: 'u128',
        OracleValue: 'FixedU128',
        DpoInfo: 'DpoInfoV1',
        Target: 'TargetV1',
        DpoMemberInfo: 'DpoMemberInfoV1',
        TravelCabinBuyerInfo: 'TravelCabinBuyerInfoV1',
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
        TravelCabinBuyerInfoV1: {
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
        TargetV1: {
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
        DpoInfoV1: {
          index: 'DpoIndex',
          name: 'Text',
          token_id: 'CurrencyId',
          manager: 'AccountId',
          target: 'TargetV1',
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
        DpoMemberInfoV1: {
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
          _enum: [
            'Deposit',
            'Bonus',
            'MilestoneReward',
            'Yield',
            'UnusedFund',
            'WithdrawOnCompletion',
            'WithdrawOnFailure'
          ]
        },
        DpoInfoV2: {
          index: 'DpoIndex',
          name: 'Text',
          token_id: 'CurrencyId',
          manager: 'AccountId',
          target: 'TargetV2',
          target_maturity: 'BlockNumber',
          target_amount: 'Balance',
          target_yield_estimate: 'Balance',
          target_bonus_estimate: 'Balance',
          issued_shares: 'Balance',
          share_rate: '(Balance, Balance)',
          fifo: 'Vec<Buyer>',
          base_fee: 'u32',
          fee: 'u32',
          fee_slashed: 'bool',
          vault_deposit: 'Balance',
          vault_withdraw: 'Balance',
          vault_yield: 'Balance',
          vault_bonus: 'Balance',
          total_fund: 'Balance',
          total_yield_received: 'Balance',
          total_bonus_received: 'Balance',
          total_milestone_received: 'Balance',
          blk_of_last_yield: 'Option<BlockNumber>',
          blk_of_dpo_filled: 'Option<BlockNumber>',
          expiry_blk: 'BlockNumber',
          state: 'DpoState',
          referrer: 'Option<AccountId>',
          fare_withdrawn: 'bool',
          direct_referral_rate: 'u32'
        },
        TargetV2: {
          _enum: {
            Dpo: '(DpoIndex, Balance)',
            TravelCabin: 'TravelCabinIndex'
          }
        },
        DpoMemberInfoV2: {
          buyer: 'Buyer',
          share: 'Balance',
          referrer: 'Referrer'
        },
        TravelCabinBuyerInfoV2: {
          buyer: 'Buyer',
          purchase_blk: 'BlockNumber',
          yield_withdrawn: 'Balance',
          fare_withdrawn: 'bool'
        },
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
        },
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
        PoolId: {
          _enum: {
            DexYieldFarming: 'CurrencyId'
          }
        }
      }
    },
    {
      minmax: [105, undefined],
      types: {
        CallOf: 'Call',
        DispatchTime: {
          _enum: {
            At: 'BlockNumber',
            After: 'BlockNumber'
          }
        },
        ScheduleTaskIndex: 'u32',
        DelayedOrigin: {
          delay: 'BlockNumber',
          origin: 'PalletsOrigin'
        },
        AuthorityOrigin: 'DelayedOrigin',
        StorageValue: 'Vec<u8>',
        GraduallyUpdate: {
          key: 'StorageKey',
          targetValue: 'StorageValue',
          perBlock: 'StorageValue'
        },
        StorageKeyBytes: 'Vec<u8>',
        StorageValueBytes: 'Vec<u8>',
        RpcDataProviderId: 'Text',
        DataProviderId: 'u8',
        TimestampedValue: {
          value: 'OracleValue',
          timestamp: 'Moment'
        },
        TimestampedValueOf: 'TimestampedValue',
        OrderedSet: 'Vec<AccountId>',
        OrmlAccountData: {
          free: 'Balance',
          frozen: 'Balance',
          reserved: 'Balance'
        },
        OrmlBalanceLock: {
          amount: 'Balance',
          id: 'LockIdentifier'
        },
        AuctionInfo: {
          bid: 'Option<(AccountId, Balance)>',
          start: 'BlockNumber',
          end: 'Option<BlockNumber>'
        },
        DelayedDispatchTime: {
          _enum: {
            At: 'BlockNumber',
            After: 'BlockNumber'
          }
        },
        DispatchId: 'u32',
        Price: 'FixedU128',
        OrmlVestingSchedule: {
          start: 'BlockNumber',
          period: 'BlockNumber',
          periodCount: 'u32',
          perPeriod: 'Compact<Balance>'
        },
        VestingScheduleOf: 'OrmlVestingSchedule',
        PoolInfo: {
          total_shares: 'Balance',
          total_rewards: 'Balance',
          total_withdrawn_rewards: 'Balance'
        },
        Share: 'u128',
        OracleValue: 'FixedU128',
        DpoInfo: 'DpoInfoV2',
        Target: 'TargetV2',
        DpoMemberInfo: 'DpoMemberInfoV2',
        TravelCabinBuyerInfo: 'TravelCabinBuyerInfoV2',
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
        TravelCabinBuyerInfoV1: {
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
        TargetV1: {
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
        DpoInfoV1: {
          index: 'DpoIndex',
          name: 'Text',
          token_id: 'CurrencyId',
          manager: 'AccountId',
          target: 'TargetV1',
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
        DpoMemberInfoV1: {
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
          _enum: [
            'Deposit',
            'Bonus',
            'MilestoneReward',
            'Yield',
            'UnusedFund',
            'WithdrawOnCompletion',
            'WithdrawOnFailure'
          ]
        },
        DpoInfoV2: {
          index: 'DpoIndex',
          name: 'Text',
          token_id: 'CurrencyId',
          manager: 'AccountId',
          target: 'TargetV2',
          target_maturity: 'BlockNumber',
          target_amount: 'Balance',
          target_yield_estimate: 'Balance',
          target_bonus_estimate: 'Balance',
          issued_shares: 'Balance',
          share_rate: '(Balance, Balance)',
          fifo: 'Vec<Buyer>',
          base_fee: 'u32',
          fee: 'u32',
          fee_slashed: 'bool',
          vault_deposit: 'Balance',
          vault_withdraw: 'Balance',
          vault_yield: 'Balance',
          vault_bonus: 'Balance',
          total_fund: 'Balance',
          total_yield_received: 'Balance',
          total_bonus_received: 'Balance',
          total_milestone_received: 'Balance',
          blk_of_last_yield: 'Option<BlockNumber>',
          blk_of_dpo_filled: 'Option<BlockNumber>',
          expiry_blk: 'BlockNumber',
          state: 'DpoState',
          referrer: 'Option<AccountId>',
          fare_withdrawn: 'bool',
          direct_referral_rate: 'u32'
        },
        TargetV2: {
          _enum: {
            Dpo: '(DpoIndex, Balance)',
            TravelCabin: 'TravelCabinIndex'
          }
        },
        DpoMemberInfoV2: {
          buyer: 'Buyer',
          share: 'Balance',
          referrer: 'Referrer'
        },
        TravelCabinBuyerInfoV2: {
          buyer: 'Buyer',
          purchase_blk: 'BlockNumber',
          yield_withdrawn: 'Balance',
          fare_withdrawn: 'bool'
        },
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
        },
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
        PoolId: {
          _enum: {
            DexYieldFarming: 'CurrencyId'
          }
        }
      }
    }
  ]
};

export default definitions;
