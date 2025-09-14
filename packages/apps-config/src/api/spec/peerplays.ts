// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  rpc: {
    fractionalNft: {
      wildcardThreshold: {
        description: 'Get the wildcard threshold',
        params: [],
        type: 'WildcardThresholdType'
      },
      wildcardCollectionId: {
        description: 'Get the wildcard threshold',
        params: [],
        type: 'CollectionId'
      },
      wildcardDistributionMap: {
        description: 'Get the wildcard distribution map',
        params: [],
        type: 'Vec<(BlockNumber, ItemId)>'
      },
      totalFnftsMinted: {
        description: 'Get the total fNFTs minted',
        params: [],
        type: 'TotalfNFTsMintedType'
      },
      collectionsCount: {
        description: 'Get the total number of collections',
        params: [],
        type: 'CollectionId'
      },
      itemsCount: {
        description: 'Get the total number of items in a collection',
        params: [
          {
            name: 'collection_id',
            type: 'CollectionId'
          }
        ],
        type: 'ItemId'
      },
      nftInfo: {
        description: 'Get NFT information for a collection',
        params: [
          {
            name: 'collection_id',
            type: 'CollectionId'
          }
        ],
        type: 'NftInfo'
      },
      owner: {
        description: 'Get the owner of an item in a collection',
        params: [
          {
            name: 'collection_id',
            type: 'CollectionId'
          },
          {
            name: 'item_id',
            type: 'ItemId'
          }
        ],
        type: 'Option<AccountId>'
      }
    },
    potential: {
      getPotential: {
        description: 'Get the potential of an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'Balance'
      },
      getMaxSupply: {
        description: 'Get the maximum supply',
        params: [],
        type: 'BalanceOf'
      },
      getTotalPotentialMinted: {
        description: 'Get the total potential minted',
        params: [],
        type: 'BalanceOf'
      },
      getMonthSupply: {
        description: 'Get the month supply',
        params: [],
        type: 'BalanceOf'
      },
      getMonthPotentialMinted: {
        description: 'Get the current month total potential minted',
        params: [],
        type: 'BalanceOf'
      },
      getMonthNumber: {
        description: 'Get the current month number',
        params: [],
        type: 'MonthNumber'
      },
      getCycleSupply: {
        description: 'Get the current cycle supply',
        params: [],
        type: 'BalanceOf'
      },
      getCyclePotentialMinted: {
        description: 'Get the current cycle total potential minted',
        params: [],
        type: 'BalanceOf'
      },
      getCycleNumber: {
        description: 'Get the current cycle number',
        params: [],
        type: 'CycleNumber'
      },
      defaultActiveReferralShare: {
        description: 'Get the default active referral share',
        params: [],
        type: 'ActiveReferralShareType'
      },
      activeReferralShare: {
        description: 'Get the active referral share of an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'ActiveReferralShareType'
      }
    },
    referral: {
      activeReferralsCount: {
        description: 'Get count of active referrals for an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'u32'
      },
      referrer: {
        description: 'Get referrer of an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'Option<AccountId>'
      },
      activeReferrals: {
        description: 'Get active referrals of an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'Option<TreeNode<AccountId>>'
      },
      blockProducers: {
        description: 'Get block producers',
        params: [],
        type: 'Vec<AccountId>'
      },
      pendingReferrals: {
        description: 'Get pending referrals of an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'Vec<AccountId>'
      }
    },
    rewardPool: {
      accountId: {
        description: 'Get the account ID of the reward pool',
        params: [],
        type: 'AccountId'
      },
      balance: {
        description: 'Get the balance of the reward pool',
        params: [],
        type: 'Balance'
      },
      collectionIds: {
        description: 'Get the set of collection IDs associated with the reward pool',
        params: [],
        type: 'BTreeSet<CollectionId>'
      },
      itemIds: {
        description: 'Get the set of item IDs for a given collection in the reward pool',
        params: [
          {
            name: 'collection_id',
            type: 'CollectionId'
          }
        ],
        type: 'BTreeSet<ItemId>'
      }
    },
    techcommitteemanager: {
      candidates: {
        description: 'Get the list of technical committee candidates',
        params: [],
        type: 'Vec<AccountId>'
      },
      selectedCandidates: {
        description: 'Get the list of selected technical committee candidates',
        params: [],
        type: 'Vec<AccountId>'
      }
    },
    validatormanager: {
      validators: {
        description: 'Get the list of validator candidates',
        params: [],
        type: 'Vec<AccountId>'
      },
      selectedValidators: {
        description: 'Get the list of selected validators',
        params: [],
        type: 'Vec<AccountId>'
      },
      activeValidators: {
        description: 'Get the list of active validators',
        params: [],
        type: 'Vec<AccountId>'
      },
      offlineValidators: {
        description: 'Get the list of active validators who went offline',
        params: [],
        type: 'Vec<(AccountId, AuthIndex, SessionIndex)>'
      },
      offenceValidators: {
        description: 'Get the list of active validators who made the offence',
        params: [],
        type: 'Vec<(AccountId, AuthIndex, SessionIndex)>'
      },
      validatorNonce: {
        description: 'Get validator nonce',
        params: [],
        type: 'NonceType'
      },
      lastMaintenanceIndex: {
        description: 'Get last maintenance index',
        params: [],
        type: 'MaintenanceIndex'
      },
      nextMaintenanceIndex: {
        description: 'Get next maintenance index',
        params: [],
        type: 'MaintenanceIndex'
      }
    }
  },
  types: [
    {
      minmax: [0, undefined],
      types: {
        AccountId: 'EthereumAccountId',
        AccountId20: 'EthereumAccountId',
        AccountId32: 'EthereumAccountId',
        ActiveReferralShareType: 'u32',
        Address: 'AccountId',
        AuthIndex: 'u32',
        Balance: 'u128',
        BalanceOf: 'Balance',
        BlockNumber: 'u32',
        BTreeSet: 'Vec',
        CollectionId: 'u32',
        CycleNumber: 'u32',
        EthereumSignature: {
          r: 'H256',
          s: 'H256',
          v: 'U8'
        },
        ExtrinsicSignature: 'EthereumSignature',
        ItemId: 'u32',
        Lookup0: 'AccountId',
        LookupSource: 'AccountId',
        MaintenanceIndex: 'u32',
        MaintenanceType: 'u32',
        MaxWildcardEntriesType: 'u32',
        MonthNumber: 'u32',
        NftInfo: {
          address: 'H160',
          token_id: 'U256'
        },
        NonceType: 'u32',
        SessionIndex: 'u32',
        TotalfNFTsMintedType: 'u32',
        TreeNode: {
          parent: 'Option<AccountId>',
          children: 'Vec<AccountId>'
        },
        WildcardThresholdType: 'u32'
      }
    }
  ]
};

export default definitions;
