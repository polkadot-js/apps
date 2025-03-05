export const BEVM_TYPES =  {
  "AssetId": "u32",
  "TokenInfo": {
    "assetId": "AssetId",
    "assetInfo": "AssetInfo"
  },
  "AssetInfo": {
    "token": "String",
    "tokenName": "String",
    "chain": "Chain",
    "decimals": "Decimals",
    "desc": "String"
  },
  "Chain": {
    "_enum": [
      "ChainX",
      "Bitcoin",
      "Ethereum",
      "Polkadot",
      "Dogecoin",
      "Binance"
    ]
  },
  "String": "Text",
  "Decimals": "u8",
  "AssetRestrictions": {
    "bits": "u32"
  },
  "AssetType": {
    "_enum": [
      "Usable",
      "Locked",
      "Reserved",
      "ReservedWithdrawal",
      "ReservedDexSpot"
    ]
  },
  "Desc": "Vec<u8>",
  "Token": "Vec<u8>",
  "Amount": "i128",
  "AmountOf": "Amount",
  "CurrencyIdOf": "AssetId",
  "CurrencyId": "AssetId",
  "AssetRestriction": {
    "_enum": [
      "Move",
      "Transfer",
      "Deposit",
      "Withdraw",
      "DestroyWithdrawal",
      "DestroyFree"
    ]
  },
  "Handicap": {
    "highestBid": "Price",
    "lowestAsk": "Price"
  },
  "NetworkType": {
    "_enum": [
      "Mainnet",
      "Testnet"
    ]
  },
  "Order": {
    "props": "OrderProperty",
    "status": "OrderStatus",
    "remaining": "Balance",
    "executedIndices": "Vec<TradingHistoryIndex>",
    "alreadyFilled": "Balance",
    "lastUpdateAt": "BlockNumber"
  },
  "OrderProperty": {
    "id": "OrderId",
    "side": "Side",
    "price": "Price",
    "amount": "Amount",
    "pairId": "TradingPairId",
    "submitter": "AccountId",
    "orderType": "OrderType",
    "createdAt": "BlockNumber"
  },
  "TotalAssetInfo": {
    "info": "AssetInfo",
    "balance": "BTreeMap<AssetType, Balance>",
    "isOnline": "bool",
    "restrictions": "AssetRestrictions"
  },
  "NominatorLedger": {
    "nomination": "Balance",
    "lastVoteWeight": "VoteWeight",
    "lastVoteWeightUpdate": "BlockNumber",
    "unbondedChunks": "Vec<Unbonded>"
  },
  "Unbonded": {
    "value": "Balance",
    "lockedUntil": "BlockNumber"
  },
  "WithdrawalRecordId": "u32",
  "WithdrawalState": {
    "_enum": [
      "Applying",
      "Processing",
      "NormalFinish",
      "RootFinish",
      "NormalCancel",
      "RootCancel"
    ]
  },
  "WithdrawalRecord": {
    "assetId": "AssetId",
    "applicant": "AccountId",
    "balance": "Balance",
    "addr": "AddrStr",
    "ext": "Memo",
    "height": "BlockNumber"
  },
  "WithdrawalLimit": {
    "minimalWithdrawal": "Balance",
    "fee": "Balance"
  },
  "TrusteeInfoConfig": {
    "minTrusteeCount": "u32",
    "maxTrusteeCount": "u32"
  },
  "GenericTrusteeIntentionProps": {
    "about": "Text",
    "hotEntity": "Vec<u8>",
    "coldEntity": "Vec<u8>"
  },
  "GenericTrusteeSessionInfo": {
    "trusteeList": "Vec<AccountId>",
    "threshold": "u16",
    "hotAddress": "Vec<u8>",
    "coldAddress": "Vec<u8>"
  },
  "ChainAddress": "Vec<u8>",
  "BtcTrusteeType": "Vec<u8>",
  "BtcTrusteeAddrInfo": {
    "addr": "BtcAddress",
    "redeemScript": "Vec<u8>"
  },
  "BtcTrusteeIntentionProps": {
    "about": "Text",
    "hotEntity": "BtcTrusteeType",
    "coldEntity": "BtcTrusteeType"
  },
  "BtcTrusteeSessionInfo": {
    "trusteeList": "Vec<(AccountId, u64)>",
    "threshold": "u16",
    "hotAddress": "BtcTrusteeAddrInfo",
    "coldAddress": "BtcTrusteeAddrInfo",
    "multiAccount": "Option<AccountId>",
    "startHeight": "Option<BlockNumber>",
    "endHeight": "Option<BlockNumber>"
  },
  "BtcNetwork": {
    "_enum": [
      "Mainnet",
      "Testnet"
    ]
  },
  "BtcAddress": "Text",
  "BtcHeader": "Vec<u8>",
  "BtcTransaction": "Vec<u8>",
  "BtcPartialMerkleTree": "Vec<u8>",
  "BtcRelayedTxInfo": {
    "blockHash": "H256",
    "merkleProof": "BtcPartialMerkleTree"
  },
  "BtcHeaderIndex": {
    "hash": "H256",
    "height": "u32"
  },
  "BtcTxResult": {
    "_enum": [
      "Success",
      "Failure"
    ]
  },
  "BtcTxState": {
    "txType": "BtcTxType",
    "result": "BtcTxResult"
  },
  "BtcTxType": {
    "_enum": [
      "Withdrawal",
      "Deposit",
      "HotAndCold",
      "TrusteeTransition",
      "Irrelevance"
    ]
  },
  "BtcDepositCache": {
    "txid": "H256",
    "balance": "u64"
  },
  "BtcVoteResult": {
    "_enum": [
      "Unfinish",
      "Finish"
    ]
  },
  "BtcWithdrawalProposal": {
    "sigState": "BtcVoteResult",
    "withdrawalIdList": "Vec<u32>",
    "tx": "BtcTransaction",
    "trusteeList": "Vec<(AccountId, bool)>"
  },
  "BtcTxVerifier": {
    "_enum": [
      "Recover",
      "RuntimeInterface"
    ]
  },
  "RpcTotalAssetInfo": {
    "info": "AssetInfo",
    "balance": "BTreeMap<AssetType, RpcBalance>",
    "isOnline": "bool",
    "restrictions": "AssetRestrictions"
  },
  "RpcOrder": {
    "id": "OrderId",
    "side": "Side",
    "price": "RpcPrice",
    "amount": "RpcBalance",
    "pairId": "TradingPairId",
    "submitter": "AccountId",
    "orderType": "OrderType",
    "createdAt": "BlockNumber",
    "status": "OrderStatus",
    "remaining": "RpcBalance",
    "executedIndices": "Vec<TradingHistoryIndex>",
    "alreadyFilled": "RpcBalance",
    "reservedBalance": "RpcBalance",
    "lastUpdateAt": "BlockNumber"
  },
  "RpcWithdrawalRecord": {
    "assetId": "AssetId",
    "applicant": "AccountId",
    "balance": "RpcBalance",
    "addr": "String",
    "ext": "String",
    "height": "BlockNumber",
    "state": "WithdrawalState"
  },
  "RpcMiningDividendInfo": {
    "own": "RpcBalance",
    "other": "RpcBalance",
    "insufficientStake": "RpcBalance"
  },
  "RpcInclusionFee": {
    "baseFee": "RpcBalance",
    "lenFee": "RpcBalance",
    "adjustedWeightFee": "RpcBalance"
  },
  "RpcFeeDetails": {
    "inclusionFee": "Option<RpcInclusionFee>",
    "tip": "RpcBalance",
    "extraFee": "RpcBalance",
    "finalFee": "RpcBalance"
  },
  "ValidatorInfo": {
    "account": "AccountId",
    "registeredAt": "BlockNumber",
    "isChilled": "bool",
    "lastChilled": "Option<BlockNumber>",
    "totalNomination": "RpcBalance",
    "lastTotalVoteWeight": "RpcVoteWeight",
    "lastTotalVoteWeightUpdate": "BlockNumber",
    "isValidating": "bool",
    "selfBonded": "RpcBalance",
    "referralId": "String",
    "rewardPotAccount": "AccountId",
    "rewardPotGasBalance": "RpcBalance",
    "rewardPotGovBalance": "RpcBalance",
    "rewardPotBtcBalance": "RpcBalance",
    "rewardPotBevmBalance": "RpcBalance",
    "evmAccount": "Option<H160>",
  },
  "FullPairInfo": {
    "baseCurrency": "AssetId",
    "highestBid": "RpcPrice",
    "id": "TradingPairId",
    "latestPrice": "RpcPrice",
    "latestPriceUpdatedAt": "BlockNumber",
    "lowestAsk": "RpcPrice",
    "maxValidBid": "RpcPrice",
    "minValidAsk": "RpcPrice",
    "pipDecimals": "u32",
    "quoteCurrency": "AssetId",
    "tickDecimals": "u32",
    "tradable": "bool"
  },
  "MiningAssetInfo": {
    "assetId": "AssetId",
    "miningPower": "FixedAssetPower",
    "rewardPot": "AccountId",
    "rewardPotBalance": "RpcBalance",
    "lastTotalMiningWeight": "RpcMiningWeight",
    "lastTotalMiningWeightUpdate": "BlockNumber"
  },
  "Depth": {
    "asks": "Vec<(RpcPrice, RpcBalance)>",
    "bids": "Vec<(RpcPrice, RpcBalance)>"
  },
  "Page": {
    "pageIndex": "u32",
    "pageSize": "u32",
    "data": "Vec<RpcOrder>"
  },
  "Price": "u128",
  "Balance": "u128",
  "MiningWeight": "u128",
  "VoteWeight": "u128",
  "RpcPrice": "String",
  "RpcBalance": "String",
  "RpcMiningWeight": "String",
  "RpcVoteWeight": "String",
  "OrderInfo": "Order",
  "HandicapInfo": "Handicap",
  "FullIdentification": "ValidatorId",
  "WithdrawalRecordOf": "WithdrawalRecord",
  "ChainId": "u8",
  "BlockLength": "u32",
  "BlockWeights": {
    "baseBlock": "Weight",
    "maxBlock": "Weight",
    "perClass": "PerDispatchClass"
  },
  "PerDispatchClass": {
    "normal": "WeightPerClass",
    "operational": "WeightPerClass",
    "mandatory": "WeightPerClass"
  },
  "WeightPerClass": {
    "baseExtrinsic": "Weight",
    "maxExtrinsic": "Weight",
    "maxTotal": "Option<Weight>",
    "reserved": "Option<Weight>"
  },
  "Address": "MultiAddress",
  "LookupSource": "MultiAddress",
  "RequestId": "u128",
  "BlockNumberFor": "BlockNumber",
  "Vault": {
    "id": "AccountId",
    "toBeIssuedTokens": "Balance",
    "issuedTokens": "Balance",
    "toBeRedeemedTokens": "Balance",
    "wallet": "Text",
    "bannedUntil": "BlockNumber",
    "status": "VaultStatus"
  },
  "VaultStatus": {
    "_enum": [
      "Active",
      "Liquidated",
      "CommittedTheft"
    ]
  },
  "TradingPrice": {
    "price": "u128",
    "decimal": "u8"
  },
  "AddrStr": "Text",
  "Network": {
    "_enum": [
      "Mainnet",
      "Testnet"
    ]
  },
  "AddressHash": "H160",
  "IssueRequest": {
    "vault": "AccountId",
    "openTime": "BlockNumber",
    "requester": "AccountId",
    "btcAddress": "BtcAddress",
    "completed": "bool",
    "cancelled": "bool",
    "btcAmount": "Balance",
    "griefingCollateral": "Balance"
  },
  "RedeemRequestStatus": {
    "_enum": [
      "Processing",
      "Cancled",
      "Completed"
    ]
  },
  "RedeemRequest": {
    "vault": "AccountId",
    "openTime": "BlockNumber",
    "requester": "AccountId",
    "btcAddress": "BtcAddress",
    "amount": "Balance",
    "redeemFee": "Balance",
    "status": "RedeemRequestStatus",
    "reimburse": "bool"
  },
  "chainbridge::ChainId": "u8",
  "ResourceId": "[u8; 32]",
  "DepositNonce": "u64",
  "ProposalVotes": {
    "votesFor": "Vec<AccountId>",
    "votesAgainst": "Vec<AccountId>",
    "status": "enum"
  },
  "Erc721Token": {
    "id": "TokenId",
    "metadata": "Vec<u8>"
  },
  "TokenId": "U256",
  "BtcHeaderInfo": {
    "header": "BtcHeader",
    "height": "u32"
  },
  "BtcParams": {
    "maxBits": "u32",
    "blockMaxFuture": "u32",
    "targetTimespanSeconds": "u32",
    "targetSpacingSeconds": "u32",
    "retargetingFactor": "u32",
    "retargetingInterval": "u32",
    "minTimespan": "u32",
    "maxTimespan": "u32"
  },
  "Memo": "Text",
  "OrderExecutedInfo": {
    "tradingHistoryIdx": "TradingHistoryIndex",
    "pairId": "TradingPairId",
    "price": "Price",
    "maker": "AccountId",
    "taker": "AccountId",
    "makerOrderId": "OrderId",
    "takerOrderId": "OrderId",
    "turnover": "Balance",
    "executedAt": "BlockNumber"
  },
  "TradingPairProfile": {
    "id": "TradingPairId",
    "currencyPair": "CurrencyPair",
    "pipDecimals": "u32",
    "tickDecimals": "u32",
    "tradable": "bool"
  },
  "TradingPairId": "u32",
  "OrderType": {
    "_enum": [
      "Limit",
      "Market"
    ]
  },
  "Side": {
    "_enum": [
      "Buy",
      "Sell"
    ]
  },
  "LockedType": {
    "_enum": [
      "Bonded",
      "BondedWithdrawal"
    ]
  },
  "TradingPairInfo": {
    "latestPrice": "Price",
    "lastUpdated": "BlockNumber"
  },
  "MiningDividendInfo": {
    "own": "Balance",
    "other": "Balance",
    "insufficientStake": "Balance"
  },
  "AssetLedger": {
    "lastTotalMiningWeight": "MiningWeight",
    "lastTotalMiningWeightUpdate": "BlockNumber"
  },
  "MinerLedger": {
    "lastMiningWeight": "MiningWeight",
    "lastMiningWeightUpdate": "BlockNumber",
    "lastClaim": "Option<BlockNumber>"
  },
  "ClaimRestriction": {
    "stakingRequirement": "StakingRequirement",
    "frequencyLimit": "BlockNumber"
  },
  "NominatorInfo": {
    "lastRebond": "Option<BlockNumber>"
  },
  "BondRequirement": {
    "selfBonded": "Balance",
    "total": "Balance"
  },
  "ValidatorLedger": {
    "totalNomination": "Balance",
    "lastTotalVoteWeight": "VoteWeight",
    "lastTotalVoteWeightUpdate": "BlockNumber"
  },
  "ValidatorProfile": {
    "registeredAt": "BlockNumber",
    "isChilled": "bool",
    "lastChilled": "Option<BlockNumber>",
    "referralId": "ReferralId"
  },
  "GlobalDistribution": {
    "treasury": "u32",
    "mining": "u32"
  },
  "MiningDistribution": {
    "asset": "u32",
    "staking": "u32"
  },
  "InclusionFee": {
    "baseFee": "Balance",
    "lenFee": "Balance",
    "adjustedWeightFee": "Balance"
  },
  "FeeDetails": {
    "inclusionFee": "Option<InclusionFee<Balance>>",
    "extraFee": "Balance",
    "tip": "Balance",
    "finalFee": "Balance"
  },
  "UnbondedIndex": "u32",
  "OrderId": "u64",
  "TradingHistoryIndex": "u64",
  "PriceFluctuation": "u32",
  "FixedAssetPower": "u32",
  "StakingRequirement": "u32",
  "CurrencyPair": {
    "base": "AssetId",
    "quote": "AssetId"
  },
  "OrderStatus": {
    "_enum": [
      "Created",
      "PartialFill",
      "Filled",
      "PartialFillAndCanceled",
      "Canceled"
    ]
  },
  "ReferralId": "Text",
  "StakeInfo": {
    "hotkey": "AccountId",
    "coldkey": "AccountId",
    "stake": "u64"
  },
  "ColdkeyStakeInfoPair": "(AccountId, Vec<StakeInfo>)"
}
