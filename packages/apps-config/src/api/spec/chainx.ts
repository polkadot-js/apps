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
        Address: 'AccountId',
        LookupSource: 'AccountId',
        Chain: {
          _enum: [
            'ChainX',
            'Bitcoin',
            'Ethereum',
            'Polkadot'
          ]
        },
        NetworkType: {
          _enum: [
            'Mainnet',
            'Testnet'
          ]
        },
        AssetType: {
          _enum: [
            'Usable',
            'Locked',
            'Reserved',
            'ReservedWithdrawal',
            'ReservedDexSpot'
          ]
        },
        OrderType: {
          _enum: [
            'Limit',
            'Market'
          ]
        },
        Side: {
          _enum: [
            'Buy',
            'Sell'
          ]
        },
        LockedType: {
          _enum: [
            'Bonded',
            'BondedWithdrawal'
          ]
        },
        Memo: 'Text',
        AssetInfo: {
          token: 'String',
          tokenName: 'String',
          chain: 'Chain',
          decimals: 'Decimals',
          desc: 'String'
        },
        TradingPairProfile: {
          id: 'TradingPairId',
          currencyPair: 'CurrencyPair',
          pipDecimals: 'u32',
          tickDecimals: 'u32',
          tradable: 'bool'
        },
        Order: {
          props: 'OrderProperty',
          status: 'OrderStatus',
          remaining: 'Balance',
          executedIndices: 'Vec<TradingHistoryIndex>',
          alreadyFilled: 'Balance',
          lastUpdateAt: 'BlockNumber'
        },
        TradingPairInfo: {
          latestPrice: 'Price',
          lastUpdated: 'BlockNumber'
        },
        OrderExecutedInfo: {
          tradingHistoryIdx: 'TradingHistoryIndex',
          pairId: 'TradingPairId',
          price: 'Price',
          maker: 'AccountId',
          taker: 'AccountId',
          makerOrderId: 'OrderId',
          takerOrderId: 'OrderId',
          turnover: 'Balance',
          executedAt: 'BlockNumber'
        },
        BtcHeaderInfo: {
          header: 'BtcHeader',
          height: 'u32'
        },
        BtcParams: {
          maxBits: 'u32',
          blockMaxFuture: 'u32',
          targetTimespanSeconds: 'u32',
          targetSpacingSeconds: 'u32',
          retargetingFactor: 'u32',
          retargetingInterval: 'u32',
          minTimespan: 'u32',
          maxTimespan: 'u32'
        },
        MiningAssetInfo: {
          assetId: 'AssetId',
          miningPower: 'FixedAssetPower',
          rewardPot: 'AccountId',
          rewardPotBalance: 'RpcBalance',
          lastTotalMiningWeight: 'RpcMiningWeight',
          lastTotalMiningWeightUpdate: 'BlockNumber'
        },
        MiningDividendInfo: {
          own: 'Balance',
          other: 'Balance',
          insufficientStake: 'Balance'
        },
        AssetLedger: {
          lastTotalMiningWeight: 'MiningWeight',
          lastTotalMiningWeightUpdate: 'BlockNumber'
        },
        MinerLedger: {
          lastMiningWeight: 'MiningWeight',
          lastMiningWeightUpdate: 'BlockNumber',
          lastClaim: 'Option<BlockNumber>'
        },
        ClaimRestriction: {
          stakingRequirement: 'StakingRequirement',
          frequencyLimit: 'BlockNumber'
        },
        NominatorInfo: {
          lastRebond: 'Option<BlockNumber>'
        },
        BondRequirement: {
          selfBonded: 'Balance',
          total: 'Balance'
        },
        Unbonded: {
          value: 'Balance',
          lockedUntil: 'BlockNumber'
        },
        ValidatorLedger: {
          totalNomination: 'Balance',
          lastTotalVoteWeight: 'VoteWeight',
          lastTotalVoteWeightUpdate: 'BlockNumber'
        },
        NominatorLedger: {
          nomination: 'Balance',
          lastVoteWeight: 'VoteWeight',
          lastVoteWeightUpdate: 'BlockNumber',
          unbondedChunks: 'Vec<Unbonded>'
        },
        ValidatorProfile: {
          registeredAt: 'BlockNumber',
          isChilled: 'bool',
          lastChilled: 'Option<BlockNumber>',
          referralId: 'ReferralId'
        },
        GlobalDistribution: {
          treasury: 'u32',
          mining: 'u32'
        },
        MiningDistribution: {
          asset: 'u32',
          staking: 'u32'
        },
        InclusionFee: {
          baseFee: 'Balance',
          lenFee: 'Balance',
          adjustedWeightFee: 'Balance'
        },
        FeeDetails: {
          inclusionFee: 'Option<InclusionFee<Balance>>',
          extraFee: 'Balance',
          tip: 'Balance',
          finalFee: 'Balance'
        },
        UnbondedIndex: 'u32',
        Token: 'Text',
        Desc: 'Text',
        AddrStr: 'Text',
        HandicapInfo: 'Handicap',
        Price: 'u128',
        OrderId: 'u64',
        TradingPairId: 'u32',
        TradingHistoryIndex: 'u64',
        PriceFluctuation: 'u32',
        BtcAddress: 'Text',
        FixedAssetPower: 'u32',
        StakingRequirement: 'u32',
        Decimals: 'u8',
        CurrencyPair: {
          base: 'AssetId',
          quote: 'AssetId'
        },
        OrderStatus: {
          _enum: [
            'Created',
            'PartialFill',
            'Filled',
            'PartialFillAndCanceled',
            'Canceled'
          ]
        },
        AssetId: 'u32',
        MiningWeight: 'u128',
        VoteWeight: 'u128',
        ReferralId: 'Text',
        AssetRestriction: {
          _enum: [
            'Move',
            'Transfer',
            'Deposit',
            'Withdraw',
            'DestroyWithdrawal',
            'DestroyFree'
          ]
        },
        AssetRestrictions: {
          bits: 'u32'
        },
        BtcHeader: 'Vec<u8>',
        BtcNetwork: {
          _enum: [
            'Mainnet',
            'Testnet'
          ]
        },
        OrderInfo: 'Order',
        Amount: 'i128',
        AmountOf: 'Amount',
        CurrencyIdOf: 'AssetId',
        CurrencyId: 'AssetId',
        Handicap: {
          highestBid: 'Price',
          lowestAsk: 'Price'
        },
        OrderProperty: {
          id: 'OrderId',
          side: 'Side',
          price: 'Price',
          amount: 'Amount',
          pairId: 'TradingPairId',
          submitter: 'AccountId',
          orderType: 'OrderType',
          createdAt: 'BlockNumber'
        },
        TotalAssetInfo: {
          info: 'AssetInfo',
          balance: 'BTreeMap<AssetType, Balance>',
          isOnline: 'bool',
          restrictions: 'AssetRestrictions'
        },
        WithdrawalRecordId: 'u32',
        WithdrawalState: {
          _enum: [
            'Applying',
            'Processing',
            'NormalFinish',
            'RootFinish',
            'NormalCancel',
            'RootCancel'
          ]
        },
        WithdrawalRecord: {
          assetId: 'AssetId',
          applicant: 'AccountId',
          balance: 'Balance',
          addr: 'AddrStr',
          ext: 'Memo',
          height: 'BlockNumber'
        },
        WithdrawalLimit: {
          minimalWithdrawal: 'Balance',
          fee: 'Balance'
        },
        TrusteeInfoConfig: {
          minTrusteeCount: 'u32',
          maxTrusteeCount: 'u32'
        },
        GenericTrusteeIntentionProps: {
          about: 'Text',
          hotEntity: 'Vec<u8>',
          coldEntity: 'Vec<u8>'
        },
        GenericTrusteeSessionInfo: {
          trusteeList: 'Vec<AccountId>',
          threshold: 'u16',
          hotAddress: 'Vec<u8>',
          coldAddress: 'Vec<u8>'
        },
        ChainAddress: 'Vec<u8>',
        BtcTrusteeType: 'Vec<u8>',
        BtcTrusteeAddrInfo: {
          addr: 'BtcAddress',
          redeemScript: 'Vec<u8>'
        },
        BtcTrusteeIntentionProps: {
          about: 'Text',
          hotEntity: 'BtcTrusteeType',
          coldEntity: 'BtcTrusteeType'
        },
        BtcTrusteeSessionInfo: {
          trusteeList: 'Vec<AccountId>',
          threshold: 'u16',
          hotAddress: 'BtcTrusteeAddrInfo',
          coldAddress: 'BtcTrusteeAddrInfo'
        },
        BtcTransaction: 'Vec<u8>',
        BtcPartialMerkleTree: 'Vec<u8>',
        BtcRelayedTxInfo: {
          blockHash: 'H256',
          merkleProof: 'BtcPartialMerkleTree'
        },
        BtcHeaderIndex: {
          hash: 'H256',
          height: 'u32'
        },
        BtcTxResult: {
          _enum: [
            'Success',
            'Failure'
          ]
        },
        BtcTxState: {
          txType: 'BtcTxType',
          result: 'BtcTxResult'
        },
        BtcTxType: {
          _enum: [
            'Withdrawal',
            'Deposit',
            'HotAndCold',
            'TrusteeTransition',
            'Irrelevance'
          ]
        },
        BtcDepositCache: {
          txid: 'H256',
          balance: 'u64'
        },
        BtcVoteResult: {
          _enum: [
            'Unfinish',
            'Finish'
          ]
        },
        BtcWithdrawalProposal: {
          sigState: 'BtcVoteResult',
          withdrawalIdList: 'Vec<u32>',
          tx: 'BtcTransaction',
          trusteeList: 'Vec<(AccountId, bool)>'
        },
        BtcTxVerifier: {
          _enum: [
            'Recover',
            'RuntimeInterface'
          ]
        },
        RpcTotalAssetInfo: {
          info: 'AssetInfo',
          balance: 'BTreeMap<AssetType, RpcBalance>',
          isOnline: 'bool',
          restrictions: 'AssetRestrictions'
        },
        RpcOrder: {
          id: 'OrderId',
          side: 'Side',
          price: 'RpcPrice',
          amount: 'RpcBalance',
          pairId: 'TradingPairId',
          submitter: 'AccountId',
          orderType: 'OrderType',
          createdAt: 'BlockNumber',
          status: 'OrderStatus',
          remaining: 'RpcBalance',
          executedIndices: 'Vec<TradingHistoryIndex>',
          alreadyFilled: 'RpcBalance',
          reservedBalance: 'RpcBalance',
          lastUpdateAt: 'BlockNumber'
        },
        RpcWithdrawalRecord: {
          assetId: 'AssetId',
          applicant: 'AccountId',
          balance: 'RpcBalance',
          addr: 'String',
          ext: 'String',
          height: 'BlockNumber',
          state: 'WithdrawalState'
        },
        RpcMiningDividendInfo: {
          own: 'RpcBalance',
          other: 'RpcBalance',
          insufficientStake: 'RpcBalance'
        },
        RpcInclusionFee: {
          baseFee: 'RpcBalance',
          lenFee: 'RpcBalance',
          adjustedWeightFee: 'RpcBalance'
        },
        RpcFeeDetails: {
          inclusionFee: 'Option<RpcInclusionFee>',
          tip: 'RpcBalance',
          extraFee: 'RpcBalance',
          finalFee: 'RpcBalance'
        },
        ValidatorInfo: {
          account: 'AccountId',
          registeredAt: 'BlockNumber',
          isChilled: 'bool',
          lastChilled: 'Option<BlockNumber>',
          totalNomination: 'RpcBalance',
          lastTotalVoteWeight: 'RpcVoteWeight',
          lastTotalVoteWeightUpdate: 'BlockNumber',
          isValidating: 'bool',
          selfBonded: 'RpcBalance',
          referralId: 'String',
          rewardPotAccount: 'AccountId',
          rewardPotBalance: 'RpcBalance'
        },
        FullPairInfo: {
          baseCurrency: 'AssetId',
          highestBid: 'RpcPrice',
          id: 'TradingPairId',
          latestPrice: 'RpcPrice',
          latestPriceUpdatedAt: 'BlockNumber',
          lowestAsk: 'RpcPrice',
          maxValidBid: 'RpcPrice',
          minValidAsk: 'RpcPrice',
          pipDecimals: 'u32',
          quoteCurrency: 'AssetId',
          tickDecimals: 'u32',
          tradable: 'bool'
        },
        Depth: {
          asks: 'Vec<(RpcPrice, RpcBalance)>',
          bids: 'Vec<(RpcPrice, RpcBalance)>'
        },
        Page: {
          pageIndex: 'u32',
          pageSize: 'u32',
          data: 'Vec<RpcOrder>'
        },
        String: 'Text',
        Balance: 'u128',
        RpcPrice: 'String',
        RpcBalance: 'String',
        RpcMiningWeight: 'String',
        RpcVoteWeight: 'String',
        FullIdentification: 'ValidatorId',
        WithdrawalRecordOf: 'WithdrawalRecord'
      }
    }
  ]
};

export default definitions;
