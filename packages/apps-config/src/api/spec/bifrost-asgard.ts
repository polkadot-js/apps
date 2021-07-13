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
        TokenSymbol: {
          _enum: {
            ASG: 0,
            AUSD: 2,
            DOT: 3,
            KSM: 4,
            ETH: 5
          }
        },
        CurrencyId: {
          _enum: {
            Token: 'TokenSymbol',
            VToken: 'TokenSymbol',
            Native: 'TokenSymbol',
            Stable: 'TokenSymbol',
            VSToken: 'TokenSymbol',
            VSBond: '(TokenSymbol, ParaId, LeasePeriod, LeasePeriod)'
          }
        },
        CurrencyIdOf: 'CurrencyId',
        TAssetBalance: 'Balance',
        AmountOf: 'Balance',
        StorageVersion: 'Releases',
        ShareWeight: 'Balance',
        OrmlAccountData: {
          free: 'Balance',
          reserved: 'Balance',
          frozen: 'Balance'
        },
        PalletBalanceOf: 'Balance',
        BlockNumberFor: 'BlockNumber',
        NumberOrHex: {
          _enum: {
            Number: 'u64',
            Hex: 'U256'
          }
        },
        IsExtended: 'bool',
        SystemPalletId: 'PalletId',
        TrieIndex: 'u32',
        FundInfo: {
          depositor: 'AccountId',
          deposit: 'Balance',
          raised: 'Balance',
          cap: 'Balance',
          first_slot: 'LeasePeriod',
          last_slot: 'LeasePeriod',
          trie_index: 'TrieIndex',
          status: 'FundStatus'
        },
        FundStatus: {
          _enum: [
            'Ongoing',
            'Retired',
            'Success',
            'Failed',
            'Withdrew',
            'End'
          ]
        },
        ContributionStatus: {
          _enum: [
            'Contributing',
            'Contributed',
            'Redeeming',
            'Redeemed'
          ]
        },
        CrowdloanContributeCall: {
          _enum: {
            CrowdloanContribute: 'ContributeCall'
          }
        },
        ContributeCall: {
          _enum: {
            Contribute: 'Contribution'
          }
        },
        Contribution: {
          index: 'ParaId',
          value: 'BalanceOf',
          signature: 'Option<MultiSignature>'
        },
        Withdraw: {
          who: 'AccountIdOf',
          index: 'ParaId'
        },
        WithdrawCall: {
          _enum: {
            Withdraw: 'Withdraw'
          }
        },
        RewardRecord: {
          account_id: 'AccountId',
          record_amount: 'Balance'
        },
        MaxLocksOf: 'u32',
        BifrostVestingInfo: {
          locked: 'Balance',
          per_block: 'Balance',
          starting_block: 'BlockNumber'
        },
        OrderId: 'u64',
        OrderInfo: {
          owner: 'AccountIdOf',
          vsbond: 'CurrencyId',
          supply: 'u128',
          remain: 'u128',
          unit_price: 'u128',
          order_id: 'OrderId',
          order_state: 'OrderState'
        },
        OrderState: {
          _enum: [
            'InTrade',
            'Revoked',
            'Clinchd'
          ]
        },
        ZenlinkAssetId: {
          chain_id: 'u32',
          asset_type: 'u8',
          asset_index: 'u32'
        },
        ZenlinkAssetBalance: 'u128',
        PairInfo: {
          asset0: 'ZenlinkAssetId',
          asset1: 'ZenlinkAssetId',
          account: 'AccountId',
          totalLiquidity: 'ZenlinkAssetBalance',
          holdingLiquidity: 'ZenlinkAssetBalance',
          reserve0: 'ZenlinkAssetBalance',
          reserve1: 'ZenlinkAssetBalance',
          lpAssetId: 'ZenlinkAssetId'
        },
        BancorPool: {
          currency_id: 'CurrencyId',
          token_pool: 'Balance',
          vstoken_pool: 'Balance',
          token_base_supply: 'Balance',
          vstoken_base_supply: 'Balance'
        }
      }
    }],
  rpc: {
    chargeTransactionFee: {
      getFeeTokenAndAmount: {
        description: 'Get charging token type and amount in terms of flexible transaction fee.',
        params: [
          {
            name: 'who',
            type: 'AccountId'
          },
          {
            name: 'extrinsic',
            type: 'Bytes'
          },
          {
            name: 'at',
            type: 'BlockHash',
            isHistoric: true,
            isOptional: true
          }
        ],
        type: '(CurrencyId, NumberOrHex)',
        isSubscription: false,
        jsonrpc: 'chargeTransactionFee_getFeeTokenAndAmount',
        method: 'getFeeTokenAndAmount',
        section: 'chargeTransactionFee'
      }
    },
    vtokenMint: {
      getVtokenMintRate: {
        description: 'Get current vtoken mint rate.',
        params: [
          {
            name: 'asset_id',
            type: 'CurrencyId'
          },
          {
            name: 'at',
            type: 'BlockHash',
            isHistoric: true,
            isOptional: true
          }
        ],
        type: 'String',
        isSubscription: false,
        jsonrpc: 'vtokenMint_getVtokenMintRate',
        method: 'getVtokenMintRate',
        section: 'vtokenMint'
      }
    },
    zenlinkProtocol: {
      getAllAssets: {
        description: 'zenlinkProtocol getAllAssets',
        params: [
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'Vec<ZenlinkAssetId>',
        isSubscription: false,
        jsonrpc: 'zenlinkProtocol_getAllAssets',
        method: 'getAllAssets',
        section: 'zenlinkProtocol'
      },
      getBalance: {
        description: 'zenlinkProtocol getBalance',
        params: [
          {
            name: 'asset_id',
            type: 'ZenlinkAssetId'
          },
          {
            name: 'account',
            type: 'AccountId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'String',
        isSubscription: false,
        jsonrpc: 'zenlinkProtocol_getBalance',
        method: 'getBalance',
        section: 'zenlinkProtocol'
      },
      getSovereignsInfo: {
        description: 'Get the ownership of a certain currency for each parachain.',
        params: [
          {
            name: 'asset_id',
            type: 'ZenlinkAssetId'
          },
          {
            name: 'at',
            type: 'BlockHash',
            isHistoric: true,
            isOptional: true
          }
        ],
        type: '(u32, AccountId, String)',
        isSubscription: false,
        jsonrpc: 'zenlinkProtocol_getSovereignsInfo',
        method: 'getSovereignsInfo',
        section: 'zenlinkProtocol'
      },
      getAllPairs: {
        description: 'Get the information of all the exchange pairs.',
        params: [
          {
            name: 'at',
            type: 'BlockHash',
            isHistoric: true,
            isOptional: true
          }
        ],
        type: 'Vec<PairInfo>',
        isSubscription: false,
        jsonrpc: 'zenlinkProtocol_getAllPairs',
        method: 'getAllPairs',
        section: 'zenlinkProtocol'
      },
      getOwnerPairs: {
        description: 'Get ownership of all exchange pairs for a particular account.',
        params: [
          {
            name: 'owner',
            type: 'AccountId'
          },
          {
            name: 'at',
            type: 'BlockHash',
            isHistoric: true,
            isOptional: true
          }
        ],
        type: 'Vec<PairInfo>',
        isSubscription: false,
        jsonrpc: 'zenlinkProtocol_getOwnerPairs',
        method: 'getOwnerPairs',
        section: 'zenlinkProtocol'
      },
      getPairByAssetId: {
        description: 'Get the detailed information of a particular exchange pair.',
        params: [
          {
            name: 'asset_0',
            type: 'ZenlinkAssetId'
          },
          {
            name: 'asset_1',
            type: 'ZenlinkAssetId'
          },
          {
            name: 'at',
            type: 'BlockHash',
            isHistoric: true,
            isOptional: true
          }
        ],
        type: 'PairInfo',
        isSubscription: false,
        jsonrpc: 'zenlinkProtocol_getPairByAssetId',
        method: 'getPairByAssetId',
        section: 'zenlinkProtocol'
      },
      getAmountInPrice: {
        description: 'Get the output token amount for an exact input token amount.',
        params: [
          {
            name: 'supply',
            type: 'ZenlinkAssetBalance'
          },
          {
            name: 'path',
            type: 'Vec<ZenlinkAssetId>'
          },
          {
            name: 'at',
            type: 'BlockHash',
            isHistoric: true,
            isOptional: true
          }
        ],
        type: 'u128',
        isSubscription: false,
        jsonrpc: 'zenlinkProtocol_getAmountInPrice',
        method: 'getAmountInPrice',
        section: 'zenlinkProtocol'
      },
      getAmountOutPrice: {
        description: 'Get the input token amount for an exact output token amount.',
        params: [
          {
            name: 'supply',
            type: 'ZenlinkAssetBalance'
          },
          {
            name: 'path',
            type: 'Vec<ZenlinkAssetId>'
          },
          {
            name: 'at',
            type: 'BlockHash',
            isHistoric: true,
            isOptional: true
          }
        ],
        type: 'u128',
        isSubscription: false,
        jsonrpc: 'zenlinkProtocol_getAmountOutPrice',
        method: 'getAmountOutPrice',
        section: 'zenlinkProtocol'
      },
      getEstimateLptoken: {
        description: 'Get the estimated number of LP token acquired given the desired and minimum amount for both in-token and out-token.',
        params: [
          {
            name: 'asset_0',
            type: 'ZenlinkAssetId'
          },
          {
            name: 'asset_1',
            type: 'ZenlinkAssetId'
          },
          {
            name: 'amount_0_desired',
            type: 'ZenlinkAssetBalance'
          },
          {
            name: 'amount_1_desired',
            type: 'ZenlinkAssetBalance'
          },
          {
            name: 'amount_0_min',
            type: 'ZenlinkAssetBalance'
          },
          {
            name: 'amount_1_min',
            type: 'ZenlinkAssetBalance'
          },
          {
            name: 'at',
            type: 'BlockHash',
            isHistoric: true,
            isOptional: true
          }
        ],
        type: 'u128',
        isSubscription: false,
        jsonrpc: 'zenlinkProtocol_getEstimateLptoken',
        method: 'getEstimateLptoken',
        section: 'zenlinkProtocol'
      }
    }
  },
  alias: {
    tokens: {
      AccountData: 'OrmlAccountData'
    },
    vesting: {
      VestingInfo: 'BifrostVestingInfo'
    },
    zenlinkProtocol: {
      AssetBalance: 'ZenlinkAssetBalance',
      AssetId: 'ZenlinkAssetId'
    }
  }
};

export default definitions;
