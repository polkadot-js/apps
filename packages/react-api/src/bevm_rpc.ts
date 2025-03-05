export const BEVM_RPC = {
  "xassets": {
    "getAssetsByAccount": {
      "description": "Return all assets with AssetTypes for an account (exclude native token(PCX)). The returned map would not contains the assets which is not existed for this account but existed in valid assets list.",
      "params": [
        {
          "name": "who",
          "type": "AccountId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<AssetId, BTreeMap<AssetType, RpcBalance<Balance>>>"
    },
    "getAssets": {
      "description": "get all assets balance and infos",
      "params": [
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<AssetId, RpcTotalAssetInfo>"
    }
  },
  "xspot": {
    "getTradingPairs": {
      "description": "Get the overall info of all trading pairs.",
      "params": [
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "Vec<FullPairInfo<RpcPrice<Price>, BlockNumber>>"
    },
    "getOrdersByAccount": {
      "description": "Get the orders of an account.",
      "params": [
        {
          "name": "who",
          "type": "AccountId"
        },
        {
          "name": "page_index",
          "type": "u32"
        },
        {
          "name": "page_size",
          "type": "u32"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "Page<Vec<RpcOrder<TradingPairId,AccountId,RpcBalance<Balance>,RpcPrice<Price>,BlockNumber>>>"
    },
    "getDepth": {
      "description": "Get the depth of a trading pair.",
      "params": [
        {
          "name": "pair_id",
          "type": "TradingPairId"
        },
        {
          "name": "depth_size",
          "type": "u32"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "Option<Depth<RpcPrice<Price>, RpcBalance<Balance>>>"
    }
  },
  "xgatewaybitcoin": {
    "verifyTxValid": {
      "description": "Verify transaction is valid",
      "params": [
        {
          "name": "raw_tx",
          "type": "Vec<u8>"
        },
        {
          "name": "withdrawal_id_list",
          "type": "Vec<u32>"
        },
        {
          "name": "full_amount",
          "type": "bool"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "bool"
    }
  },
  "xgatewaycommon": {
    "boundAddrs": {
      "description": "Get bound addrs for an accountid",
      "params": [
        {
          "name": "who",
          "type": "AccountId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<Chain, Vec<String>>"
    },
    "withdrawalLimit": {
      "description": "Get withdrawal limit(minimal_withdrawal&fee) for an AssetId",
      "params": [
        {
          "name": "asset_id",
          "type": "AssetId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "WithdrawalLimit<RpcBalance<Balance>>"
    },
    "withdrawalListWithFeeInfo": {
      "description": "Get withdrawal list for an AssetId",
      "params": [
        {
          "name": "asset_id",
          "type": "AssetId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<WithdrawalRecordId,(RpcWithdrawalRecord<AccountId, Balance, BlockNumber>, WithdrawalLimit<RpcBalance<Balance>>)>"
    },
    "verifyWithdrawal": {
      "description": "Use the params to verify whether the withdrawal apply is valid. Notice those params is same as the params for call `XGatewayCommon::withdraw(...)`, including checking address is valid or something else. Front-end should use this rpc to check params first, than could create the extrinsic.",
      "params": [
        {
          "name": "asset_id",
          "type": "AssetId"
        },
        {
          "name": "value",
          "type": "u64"
        },
        {
          "name": "addr",
          "type": "String"
        },
        {
          "name": "memo",
          "type": "String"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "bool"
    },
    "trusteeMultisigs": {
      "description": "Return the trustee multisig address for all chain.",
      "params": [
        {
          "name": "at",
          "type": "Option<BlockHash>)"
        }
      ],
      "type": "BTreeMap<Chain, AccountId>"
    },
    "bitcoinTrusteeProperties": {
      "description": "Return bitcoin trustee registered property info for an account(e.g. registered hot/cold address)",
      "params": [
        {
          "name": "who",
          "type": "AccountId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BtcTrusteeIntentionProps"
    },
    "bitcoinTrusteeSessionInfo": {
      "description": "Return bitcoin trustee for current session(e.g. trustee hot/cold address and else)",
      "params": [
        {
          "name": "session_number",
          "type": "i32",
          "isOptional": false
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BtcTrusteeSessionInfo<AccountId, BlockNumber>"
    },
    "bitcoinGenerateTrusteeSessionInfo": {
      "description": "Try to generate bitcoin trustee info for a list of candidates. (this api is used to check the trustee info which would be generated by those candidates)",
      "params": [
        {
          "name": "candidates",
          "type": "Vec<AccountId>"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BtcTrusteeSessionInfo<AccountId, BlockNumber>"
    }
  },
  "xgatewayrecords": {
    "withdrawalList": {
      "description": "Return current withdraw list(include Applying and Processing withdraw state)",
      "params": [
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<WithdrawalRecordId, RpcWithdrawalRecord<AccountId, Balance, BlockNumber>>"
    },
    "withdrawalListByChain": {
      "description": "Return current withdraw list for a chain(include Applying and Processing withdraw state)",
      "params": [
        {
          "name": "chain",
          "type": "Chain"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<WithdrawalRecordId, RpcWithdrawalRecord<AccountId, Balance, BlockNumber>>"
    },
    "pendingWithdrawalListByChain": {
      "description": "Return current pending withdraw list for a chain",
      "params": [
        {
          "name": "chain",
          "type": "Chain"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<WithdrawalRecordId, RpcWithdrawalRecord<AccountId, Balance, BlockNumber>>"
    }
  },
  "xminingasset": {
    "getMiningAssets": {
      "description": "Get overall information about all mining assets.",
      "params": [
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "Vec<MiningAssetInfo<AccountId,RpcBalance<Balance>,RpcMiningWeight<MiningWeight>,BlockNumber>>"
    },
    "getDividendByAccount": {
      "description": "Get the asset mining dividends info given the asset miner AccountId.",
      "params": [
        {
          "name": "who",
          "type": "AccountId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<AssetId, RpcMiningDividendInfo>"
    },
    "getMinerLedgerByAccount": {
      "description": "Get the mining ledger details given the asset miner AccountId.",
      "params": [
        {
          "name": "who",
          "type": "AccountId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<AssetId, MinerLedger<RpcMiningWeight<MiningWeight>, BlockNumber>>"
    }
  },
  "xstaking": {
    "getValidators": {
      "description": "Get overall information about all potential validators",
      "params": [
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "Vec<ValidatorInfo<AccountId, RpcBalance<Balance>, RpcVoteWeight<VoteWeight>, BlockNumber>>"
    },
    "getValidatorByAccount": {
      "description": "Get overall information given the validator AccountId.",
      "params": [
        {
          "name": "who",
          "type": "AccountId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "ValidatorInfo<AccountId, RpcBalance<Balance>, RpcVoteWeight<VoteWeight>, BlockNumber>"
    },
    "getDividendByAccount": {
      "description": "Get the staking dividends info given the staker AccountId.",
      "params": [
        {
          "name": "who",
          "type": "AccountId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<AccountId, RpcBalance<Balance>>"
    },
    "getNominationByAccount": {
      "description": "Get the nomination details given the staker AccountId.",
      "params": [
        {
          "name": "who",
          "type": "AccountId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<AccountId,NominatorLedger<RpcBalance<Balance>, RpcVoteWeight<VoteWeight>, BlockNumber>>"
    },
    "getNominatorByAccount": {
      "description": "Get individual nominator information given the nominator AccountId.",
      "params": [
        {
          "name": "who",
          "type": "AccountId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "NominatorInfo<BlockNumber>"
    },
    "checkCandidate": {
      "description": "Three checks: (1) has the desire to win the election. (2) meets the threshold of a valid candidate. (3) has set session keys by calling pallet_session set_keys. (4) has bonded evm account to mine gov rewards.",
      "params": [
        {
          "name": "who",
          "type": "AccountId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "(bool,bool,bool,bool)"
    }
  },
  "xfee": {
    "queryDetails": {
      "description": "get the fee details of extrinsic",
      "params": [
        {
          "name": "encoded_xt",
          "type": "Bytes"
        },
        {
          "name": "at",
          "type": "Option<BlockHash>"
        }
      ],
      "type": "RpcFeeDetails"
    }
  },
  "xagere": {
    "getStakeInfoForColdkey": {
      "description": "Get the staking information for a cold key",
      "params": [
        {
          "name": "coldkey_account",
          "type": "AccountId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "Vec<StakeInfo<AccountId>>"
    },
    "getStakeInfoForColdkeys": {
      "description": "Get the staking information for a list of cold keys",
      "params": [
        {
          "name": "coldkey_accounts",
          "type": "Vec<AccountId>"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "Vec<ColdkeyStakeInfoPair>"
    }
  },
}
