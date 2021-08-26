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
        AccountIdOf: 'AccountId',
        Address: 'MultiAddress',
        AirDropCurrencyId: {
          _enum: [
            'ICE',
            'EAVE'
          ]
        },
        Amount: 'i128',
        AmountOf: 'Amount',
        AsOriginId: 'AuthoritysOriginId',
        AssetId: 'u64',
        AssetIdOf: 'AssetId',
        AuctionId: 'u32',
        AuctionIdOf: 'AuctionId',
        AuctionInfo: {
          bid: 'Option<(AccountId, Balance)>',
          start: 'BlockNumber',
          end: 'Option<BlockNumber>'
        },
        AuthoritysOriginId: {
          _enum: [
            'Root',
            'EaveTreasury',
            'CdpTreasury',
            'ElpTreasury',
            'DSWF'
          ]
        },
        BalanceInfo: {
          amount: 'Balance'
        },
        BalanceRequest: {
          amount: 'Balance'
        },
        BalanceWrapper: {
          amount: 'Balance'
        },
        BondingLedger: {
          total: 'Compact<Balance>',
          active: 'Compact<Balance>',
          unlocking: 'Vec<UnlockChunk>'
        },
        CID: 'Vec<u8>',
        CallOf: 'Call',
        CallRequest: {
          from: 'Option<H160>',
          to: 'Option<H160>',
          gasLimit: 'Option<u32>',
          storageLimit: 'Option<u32>',
          value: 'Option<U128>',
          data: 'Option<Bytes>'
        },
        ChainId: {
          _enum: {
            RelayChain: 'Null',
            ParaChain: 'ParaId'
          }
        },
        ChangeBalance: {
          _enum: {
            NoChange: 'Null',
            NewValue: 'Balance'
          }
        },
        ChangeOptionRate: {
          _enum: {
            NoChange: 'Null',
            NewValue: 'OptionRate'
          }
        },
        ChangeOptionRatio: {
          _enum: {
            NoChange: 'Null',
            NewValue: 'OptionRatio'
          }
        },
        ChangeRate: {
          _enum: {
            NoChange: 'Null',
            NewValue: 'Rate'
          }
        },
        ChangeRatio: {
          _enum: {
            NoChange: 'Null',
            NewValue: 'Ratio'
          }
        },
        ClassData: {
          deposit: 'Balance',
          properties: 'Properties'
        },
        ClassId: 'u32',
        ClassIdOf: 'ClassId',
        ClassInfoOf: {
          metadata: 'CID',
          totalIssuance: 'TokenId',
          owner: 'AccountId',
          data: 'ClassData'
        },
        CodeInfo: {
          codeSize: 'u32',
          refCount: 'u32'
        },
        CollateralAuctionItem: {
          refundRecipient: 'AccountId',
          currencyId: 'CurrencyId',
          initialAmount: 'Compact<Balance>',
          amount: 'Compact<Balance>',
          target: 'Compact<Balance>',
          startTime: 'BlockNumber'
        },
        CurrencyId: {
          _enum: {
            Token: 'TokenSymbol',
            DEXShare: '(TokenSymbol, TokenSymbol)',
            ERC20: 'EvmAddress'
          }
        },
        CurrencyIdOf: 'CurrencyId',
        DataProviderId: {
          _enum: [
            'Aggregated',
            'Eave',
            'Band'
          ]
        },
        DebitAuctionItem: {
          initialAmount: 'Compact<Balance>',
          amount: 'Compact<Balance>',
          fix: 'Compact<Balance>',
          startTime: 'BlockNumber'
        },
        DelayedDispatchTime: {
          _enum: {
            At: 'BlockNumber',
            After: 'BlockNumber'
          }
        },
        DelayedOrigin: {
          delay: 'BlockNumber',
          origin: 'PalletsOrigin'
        },
        DestAddress: 'Vec<u8>',
        DispatchId: 'u32',
        DispatchTime: {
          _enum: {
            At: 'BlockNumber',
            After: 'BlockNumber'
          }
        },
        ElpUnlockChunk: {
          value: 'Compact<Balance>',
          era: 'Compact<EraIndex>'
        },
        EvmAccountInfo: {
          nonce: 'Index',
          contractInfo: 'Option<EvmContractInfo>',
          developerDeposit: 'Option<Balance>'
        },
        EvmAddress: 'H160',
        EvmContractInfo: {
          codeHash: 'H256',
          maintainer: 'H160',
          deployed: 'bool'
        },
        ExchangeRate: 'FixedU128',
        GraduallyUpdate: {
          key: 'StorageKey',
          targetValue: 'StorageValue',
          perBlock: 'StorageValue'
        },
        Keys: 'SessionKeys2',
        Ledger: {
          bonded: 'Balance',
          unbondingToFree: 'Balance',
          freePool: 'Balance',
          toUnbondNextEra: '(Balance, Balance)'
        },
        LiquidationStrategy: {
          _enum: [
            'Auction',
            'Exchange'
          ]
        },
        LiquidityPool: {
          currency_ids: 'Vec<AssetIdOf>',
          lp_token_id: 'AssetId',
          pool_config_id: 'u32',
          pool_reserves: 'Vec<Balance>'
        },
        LiquidityPoolConfig_: 'PoolConfig',
        LiquidityPool_: 'LiquidityPool',
        LookupSource: 'MultiAddress',
        NomineeId: 'AccountId',
        NFTBalance: 'u128',
        OptionRate: 'Option<Rate>',
        OptionRatio: 'Option<Ratio>',
        OracleKey: 'CurrencyId',
        OracleValue: 'Price',
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
        OrmlVestingSchedule: {
          start: 'BlockNumber',
          period: 'BlockNumber',
          periodCount: 'u32',
          perPeriod: 'Compact<Balance>'
        },
        PalletBalanceOf: 'Balance',
        PalletsOrigin: {
          _enum: {
            System: 'SystemOrigin',
            Timestamp: 'Null',
            RandomnessCollectiveFlip: 'Null',
            Balances: 'Null',
            Accounts: 'Null',
            Currencies: 'Null',
            Tokens: 'Null',
            Vesting: 'Null',
            EaveTreasury: 'Null',
            Utility: 'Null',
            Multisig: 'Null',
            Recovery: 'Null',
            Proxy: 'Null',
            Scheduler: 'Null',
            Indices: 'Null',
            GraduallyUpdate: 'Null',
            Authorship: 'Null',
            Babe: 'Null',
            Grandpa: 'Null',
            Staking: 'Null',
            Session: 'Null',
            Historical: 'Null',
            GeneralCouncil: 'CollectiveOrigin',
            GeneralCouncilMembership: 'Null',
            EYECouncil: 'CollectiveOrigin',
            EYECouncilMembership: 'Null',
            ElpCouncil: 'CollectiveOrigin',
            ElpCouncilMembership: 'Null',
            TechnicalCommittee: 'CollectiveOrigin',
            TechnicalCommitteeMembership: 'Null',
            Authority: 'DelayedOrigin',
            ElectionsPhragmen: 'Null',
            EaveOracle: 'Null',
            BandOracle: 'Null',
            OperatorMembershipEave: 'Null',
            OperatorMembershipBand: 'Null',
            Auction: 'Null',
            Rewards: 'Null',
            OrmlNFT: 'Null',
            Prices: 'Null',
            Dex: 'Null',
            AuctionManager: 'Null',
            Loans: 'Null',
            EYE: 'Null',
            CdpTreasury: 'Null',
            CdpEngine: 'Null',
            EmergencyShutdown: 'Null',
            Elp: 'Null',
            NomineesElection: 'Null',
            StakingPool: 'Null',
            PolkadotBridge: 'Null',
            Incentives: 'Null',
            AirDrop: 'Null',
            NFT: 'Null',
            RenVmBridge: 'Null',
            Contracts: 'Null',
            EVM: 'Null',
            Sudo: 'Null',
            TransactionPayment: 'Null'
          }
        },
        Params: {
          targetMaxFreeUnbondedRatio: 'Ratio',
          targetMinFreeUnbondedRatio: 'Ratio',
          targetUnbondingToFreeRatio: 'Ratio',
          unbondingToFreeAdjustment: 'Ratio',
          baseFeeRate: 'Rate'
        },
        PolkadotAccountId: 'AccountId',
        PolkadotAccountIdOf: 'PolkadotAccountId',
        PoolId: {
          _enum: {
            Loans: 'CurrencyId',
            DexIncentive: 'CurrencyId',
            DexSaving: 'CurrencyId',
            Elp: 'Null'
          }
        },
        PoolInfo: {
          totalShares: 'Compact<Share>',
          totalRewards: 'Compact<Balance>',
          totalWithdrawnRewards: 'Compact<Balance>'
        },
        Position: {
          collateral: 'Balance',
          debit: 'Balance'
        },
        Price: 'FixedU128',
        Properties: {
          _set: {
            _bitLength: 8,
            Transferable: 1,
            Burnable: 2
          }
        },
        PublicKey: '[u8; 20]',
        Rate: 'FixedU128',
        Ratio: 'FixedU128',
        RedeemStrategy: {
          _enum: {
            Immediately: 'Null',
            Target: 'EraIndex',
            WaitForUnbonding: 'Null'
          }
        },
        RelaychainAccountId: 'AccountId',
        RiskManagementParams: {
          maximumTotalDebitValue: 'Balance',
          stabilityFee: 'Option<Rate>',
          liquidationRatio: 'Option<Rate>',
          liquidationPenalty: 'Option<Rate>',
          requiredCollateralRatio: 'Option<Rate>'
        },
        RpcDataProviderId: 'Text',
        ScheduleTaskIndex: 'u32',
        Share: 'u128',
        StorageKeyBytes: 'Vec<u8>',
        StorageValue: 'Vec<u8>',
        StorageValueBytes: 'Vec<u8>',
        SubAccountStatus: {
          bonded: 'Balance',
          available: 'Balance',
          unbonding: 'Vec<(EraIndex,Balance)>',
          mockRewardRate: 'Rate'
        },
        SurplusAuctionItem: {
          amount: 'Compact<Balance>',
          startTime: 'BlockNumber'
        },
        TimestampedValue: {
          value: 'OracleValue',
          timestamp: 'Moment'
        },
        TimestampedValueOf: 'TimestampedValue',
        TokenBalanceOf: 'Balance',
        TokenData: {
          deposit: 'Balance'
        },
        TokenId: 'u64',
        TokenIdOf: 'TokenId',
        TokenInfo: {
          name: 'Text',
          symbol: 'Text',
          decimals: 'u8',
          owner: 'AccountId'
        },
        TokenInfoOf: {
          metadata: 'CID',
          owner: 'AccountId',
          data: 'TokenData'
        },
        TokenSymbol: {
          _enum: {
            EAVE: 0,
            EUSD: 1,
            DOT: 2,
            LDOT: 3,
            XBTC: 4,
            RENBTC: 5,
            INTERBTC: 6,
            PLM: 7,
            PHA: 8,
            HDT: 9,
            ICE: 128,
            IUSD: 129,
            KSM: 130,
            LKSM: 131,
            SDN: 135,
            KILT: 138
          }
        },
        TradingPair: '(CurrencyId,  CurrencyId)',
        TradingPairProvisionParameters: {
          minContribution: '(Balance, Balance)',
          targetProvision: '(Balance, Balance)',
          accumulatedProvision: '(Balance, Balance)',
          notBefore: 'BlockNumber'
        },
        TradingPairStatus: {
          _enum: {
            NotEnabled: 'Null',
            Provisioning: 'TradingPairProvisionParameters',
            Enabled: 'Null'
          }
        },
        VestingScheduleOf: 'OrmlVestingSchedule',
        XCurrencyId: {
          chainId: 'ChainId',
          currencyId: 'Vec<u8>'
        }
      }
    }
  ]
};

export default definitions;
