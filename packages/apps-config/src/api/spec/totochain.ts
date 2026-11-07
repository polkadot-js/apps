// Copyright 2017-2026 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  rpc: {
    activityTracker: {
      getActivityReputation: {
        description: 'Decayed activity reputation for an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'u32'
      },
      getRawActivityReputation: {
        description: 'Activity reputation before decay',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'u32'
      },
      getActivityReputationInfo: {
        description: 'Activity reputation with its decay inputs',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'ActivityReputationInfo'
      },
      getAllActivityReputations: {
        description: 'Decayed reputation for every tracked account',
        params: [],
        type: 'ActivityReputationPage'
      },
      getAllRawActivityReputations: {
        description: 'Undecayed reputation for every tracked account',
        params: [],
        type: 'ActivityReputationPage'
      },
      calculateActivityReputationAtBlock: {
        description: 'Reputation an account would have at a given block',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          },
          {
            name: 'blockNumber',
            type: 'u32'
          }
        ],
        type: 'u32'
      },
      getMaxActivityReputation: {
        description: 'Highest activity reputation an account can reach',
        params: [],
        type: 'u32'
      },
      getActivityTrackerConfig: {
        description: '(maxReputation, weightFactor, decayFactor)',
        params: [],
        type: '(u32, u64, u32)'
      }
    },
    fractionalNft: {
      wildcardThreshold: {
        description: 'Mints required before a wildcard is distributed',
        params: [],
        type: 'Option<u32>'
      },
      wildcardCollectionId: {
        description: 'Collection wildcards are minted into',
        params: [],
        type: 'Option<u32>'
      },
      wildcardDistributionMap: {
        description: 'Scheduled wildcard distributions, by block',
        params: [],
        type: 'Vec<(u32, u32)>'
      },
      totalFnftsMinted: {
        description: 'Total fractional NFTs minted',
        params: [],
        type: 'Option<u32>'
      },
      collectionsCount: {
        description: 'Number of collections',
        params: [],
        type: 'u32'
      },
      itemsCount: {
        description: 'Number of items in a collection',
        params: [
          {
            name: 'collectionId',
            type: 'u32'
          }
        ],
        type: 'u32'
      },
      nftInfo: {
        description: 'Contract address and token id backing a collection',
        params: [
          {
            name: 'collectionId',
            type: 'u32'
          }
        ],
        type: 'NftInfo'
      },
      owner: {
        description: 'Owner of one item, if it exists',
        params: [
          {
            name: 'collectionId',
            type: 'u32'
          },
          {
            name: 'itemId',
            type: 'u32'
          }
        ],
        type: 'Option<AccountId>'
      }
    },
    handshake: {
      hasHandshakeCompleted: {
        description: 'Whether two accounts completed a handshake',
        params: [
          {
            name: 'sender',
            type: 'AccountId'
          },
          {
            name: 'recipient',
            type: 'AccountId'
          }
        ],
        type: 'bool'
      },
      getHandshakeCount: {
        description: 'Completed handshakes for an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'u32'
      },
      getCompletedHandshakes: {
        description: 'Accounts that completed a handshake with this one',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'Vec<AccountId>'
      },
      getHandshakeStatus: {
        description: 'Handshake state between two accounts',
        params: [
          {
            name: 'account1',
            type: 'AccountId'
          },
          {
            name: 'account2',
            type: 'AccountId'
          }
        ],
        type: 'Text'
      },
      handshakeExists: {
        description: 'Whether a handshake record exists at all',
        params: [
          {
            name: 'account1',
            type: 'AccountId'
          },
          {
            name: 'account2',
            type: 'AccountId'
          }
        ],
        type: 'bool'
      }
    },
    potential: {
      getPotential: {
        description: 'Potential balance of an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'u128'
      },
      getMaxSupply: {
        description: 'Maximum POTENTIAL that can ever be minted',
        params: [],
        type: 'u128'
      },
      getTotalPotentialMinted: {
        description: 'POTENTIAL minted so far, across every cycle',
        params: [],
        type: 'u128'
      },
      getMonthSupply: {
        description: 'POTENTIAL mintable in the current month',
        params: [],
        type: 'u128'
      },
      getMonthPotentialMinted: {
        description: 'POTENTIAL minted in the current month',
        params: [],
        type: 'u128'
      },
      getCycleSupply: {
        description: 'POTENTIAL mintable in the current cycle',
        params: [],
        type: 'u128'
      },
      getCyclePotentialMinted: {
        description: 'POTENTIAL minted in the current cycle',
        params: [],
        type: 'u128'
      },
      getMonthNumber: {
        description: 'The current month, counted from genesis',
        params: [],
        type: 'u32'
      },
      getCycleNumber: {
        description: 'The current cycle, counted from genesis',
        params: [],
        type: 'u32'
      },
      defaultActiveReferralShare: {
        description: 'Active-referral share applied when an account has no override',
        params: [],
        type: 'u32'
      },
      activeReferralShare: {
        description: 'Active-referral share for a specific account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'u32'
      }
    },
    referral: {
      activeReferralsCount: {
        description: 'Number of accounts in the referral subtree rooted at this account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'u32'
      },
      referrer: {
        description: 'The referrer of an account, if it has one',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'Option<AccountId>'
      },
      activeReferrals: {
        description: 'Parent and direct children of an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'Option<TreeNode>'
      },
      blockProducers: {
        description: 'Accounts currently counted as block producers',
        params: [],
        type: 'Vec<AccountId>'
      },
      blockProducersPage: {
        description: 'One page of block producers',
        params: [
          {
            name: 'pagination',
            type: 'Pagination'
          }
        ],
        type: 'PaginatedResponse'
      },
      pendingReferrals: {
        description: 'Referrals awaiting confirmation for a referrer',
        params: [
          {
            name: 'referrer',
            type: 'AccountId'
          }
        ],
        type: 'Vec<AccountId>'
      },
      pendingReferralsPage: {
        description: 'One page of pending referrals',
        params: [
          {
            name: 'referrer',
            type: 'AccountId'
          },
          {
            name: 'pagination',
            type: 'Pagination'
          }
        ],
        type: 'PaginatedResponse'
      }
    },
    reputationVoting: {
      getTally: {
        description: 'Vote tally for a poll',
        params: [
          {
            name: 'pollIndex',
            type: 'u32'
          }
        ],
        type: 'ReputationTally'
      },
      isPassing: {
        description: 'Whether a poll is currently passing',
        params: [
          {
            name: 'pollIndex',
            type: 'u32'
          }
        ],
        type: 'bool'
      },
      getVotesForAccount: {
        description: 'Every vote an account has cast',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'Vec<(u32, VoteRecord)>'
      },
      getVotingReputation: {
        description: 'Reputation an account votes with; may be negative',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'i32'
      }
    },
    rewardPool: {
      accountId: {
        description: 'Account the reward pool holds its funds in',
        params: [],
        type: 'AccountId'
      },
      balance: {
        description: 'Free balance of the reward pool account',
        params: [],
        type: 'u128'
      },
      collectionIds: {
        description: 'Collections the reward pool holds items in',
        params: [],
        type: 'Vec<u32>'
      },
      itemIds: {
        description: 'Items the reward pool holds in one collection',
        params: [
          {
            name: 'collectionId',
            type: 'u32'
          }
        ],
        type: 'Vec<u32>'
      }
    },
    techCommitteeManager: {
      candidates: {
        description: 'Accounts standing for the technical committee',
        params: [],
        type: 'Vec<AccountId>'
      },
      selectedCandidates: {
        description: 'Accounts currently on the technical committee',
        params: [],
        type: 'Vec<AccountId>'
      }
    },
    validatorManager: {
      validatorCandidates: {
        description: 'Accounts registered as validator candidates',
        params: [],
        type: 'Vec<AccountId>'
      },
      selectedValidators: {
        description: 'Candidates selected for the next session',
        params: [],
        type: 'Vec<AccountId>'
      },
      activeValidators: {
        description: 'Validators producing blocks in the current session',
        params: [],
        type: 'Vec<AccountId>'
      },
      offlineValidators: {
        description: 'Validators marked offline, with the session it happened in',
        params: [],
        type: 'Vec<(AccountId, u32)>'
      },
      offenceValidators: {
        description: 'Validators that committed an offence, with the session',
        params: [],
        type: 'Vec<(AccountId, u32)>'
      },
      getReputationForAccount: {
        description: 'Total reputation for one account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'u32'
      },
      getReputations: {
        description: 'Reputation for several accounts in one call',
        params: [
          {
            name: 'accounts',
            type: 'Vec<AccountId>'
          }
        ],
        type: 'Vec<(AccountId, u32)>'
      },
      reputationPenaltyFor: {
        description: 'Pending reputation penalty for an account',
        params: [
          {
            name: 'account',
            type: 'AccountId'
          }
        ],
        type: 'u32'
      }
    }
  },
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        AccountId: 'EthereumAccountId',
        Address: 'AccountId',
        LookupSource: 'AccountId',
        TreeNode: {
          parent: 'Option<AccountId>',
          children: 'Vec<AccountId>'
        },
        NftInfo: {
          address: 'H160',
          token_id: 'U256'
        },
        Pagination: {
          page: 'Option<u32>',
          page_size: 'Option<u32>'
        },
        PaginatedResponse: {
          items: 'Vec<AccountId>',
          total: 'Option<u32>',
          page: 'u32',
          page_size: 'u32',
          has_more: 'bool'
        },
        VoteDirection: {
          _enum: [
            'Aye',
            'Nay'
          ]
        },
        VoteRecord: {
          direction: 'VoteDirection',
          reputation: 'u32',
          voted_at: 'u32'
        },
        ReputationTally: {
          ayes: 'u128',
          nays: 'u128',
          turnout: 'u32',
          electorate: 'u128'
        },
        ActivityReputationInfo: {
          current_reputation: 'u32',
          raw_reputation: 'u32',
          last_activity_block: 'u32',
          blocks_since_activity: 'u32'
        },
        ActivityReputationPage: {
          entries: 'Vec<(AccountId, u32)>',
          truncated: 'bool'
        }
      }
    }
  ]
};

export default definitions;
