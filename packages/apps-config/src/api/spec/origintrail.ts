// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefinitionRpc, DefinitionRpcSub, OverrideBundleDefinition, OverrideBundleType } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

export const rpcDefinitions: Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>> = {
  txpool: {
    content: {
      aliasSection: 'txpool',
      description:
                'The detailed information regarding Ethereum transactions that are currently in the ' +
                'Substrate transaction pool.',
      params: [],
      type: 'TxPoolResultContent'
    },
    inspect: {
      aliasSection: 'txpool',
      description:
                'Summarized information of the Ethereum transactions that are currently in the Substrate' +
                ' transaction pool.',
      params: [],
      type: 'TxPoolResultInspect'
    },
    status: {
      aliasSection: 'txpool',
      description:
                'The number of Ethereum transaction that are currently in the Substrate transaction pool.',
      params: [],
      type: 'TxPoolResultStatus'
    }
  }
};

// structs need to be in order
/* eslint-disable sort-keys */

const origintrailDefinitions = {
  rpc: rpcDefinitions,
  types: [
    {
      minmax: [0, undefined],
      types: {
        AccountId: 'EthereumAccountId',
        AccountId32: 'H256',
        AccountInfo: 'AccountInfoWithTripleRefCount',
        Address: 'AccountId',
        AuthorId: 'AccountId32',
        Balance: 'u128',
        LookupSource: 'AccountId',
        Account: {
          nonce: 'U256',
          balance: 'u128'
        },
        ExtrinsicSignature: 'EthereumSignature',
        RoundIndex: 'u32',
        Candidate: {
          id: 'AccountId',
          fee: 'Perbill',
          bond: 'Balance',
          nominators: 'Vec<Bond>',
          total: 'Balance',
          state: 'CollatorStatus'
        },
        Nominator: {
          nominations: 'Vec<Bond>',
          total: 'Balance'
        },
        NominatorStatus: {
          _enum: ['Active', { Leaving: 'RoundIndex' }]
        },
        Nominator2: {
          nominations: 'Vec<Bond>',
          revocations: 'Vec<AccountId>',
          total: 'Balance',
          scheduled_revocations_count: 'u32',
          scheduled_revocations_total: 'Balance',
          status: 'NominatorStatus'
        },
        Bond: {
          owner: 'AccountId',
          amount: 'Balance'
        },
        CollatorStatus: {
          _enum: ['Active', 'Idle', { Leaving: 'RoundIndex' }]
        },
        TxPoolResultContent: {
          pending: 'HashMap<H160, HashMap<U256, PoolTransaction>>',
          queued: 'HashMap<H160, HashMap<U256, PoolTransaction>>'
        },
        TxPoolResultInspect: {
          pending: 'HashMap<H160, HashMap<U256, Summary>>',
          queued: 'HashMap<H160, HashMap<U256, Summary>>'
        },
        TxPoolResultStatus: {
          pending: 'U256',
          queued: 'U256'
        },
        Summary: 'Bytes',
        PoolTransaction: {
          hash: 'H256',
          nonce: 'U256',
          block_hash: 'Option<H256>',
          block_number: 'Option<U256>',
          from: 'H160',
          to: 'Option<H160>',
          value: 'U256',
          gas_price: 'U256',
          gas: 'U256',
          input: 'Bytes'
        },
        // Staking inflation
        Range: 'RangeBalance',
        RangeBalance: {
          min: 'Balance',
          ideal: 'Balance',
          max: 'Balance'
        },
        RangePerbill: {
          min: 'Perbill',
          ideal: 'Perbill',
          max: 'Perbill'
        },
        InflationInfo: {
          expect: 'RangeBalance',
          annual: 'RangePerbill',
          round: 'RangePerbill'
        },
        OrderedSet: 'Vec<Bond>',
        Collator: {
          id: 'AccountId',
          bond: 'Balance',
          nominators: 'Vec<Bond>',
          total: 'Balance',
          state: 'CollatorStatus'
        },
        Collator2: {
          id: 'AccountId',
          bond: 'Balance',
          nominators: 'Vec<AccountId>',
          top_nominators: 'Vec<Bond>',
          bottom_nominators: 'Vec<Bond>',
          total_counted: 'Balance',
          total_backing: 'Balance',
          state: 'CollatorStatus'
        },
        NominatorAdded: {
          _enum: [{ AddedToTop: 'Balance' }, 'AddedToBottom']
        },
        CollatorSnapshot: {
          bond: 'Balance',
          nominators: 'Vec<Bond>',
          total: 'Balance'
        },
        SystemInherentData: {
          validation_data: 'PersistedValidationData',
          relay_chain_state: 'StorageProof',
          downward_messages: 'Vec<InboundDownwardMessage>',
          horizontal_messages: 'BTreeMap<ParaId, Vec<InboundHrmpMessage>>'
        },
        RelayChainAccountId: 'AccountId32',
        RoundInfo: {
          current: 'RoundIndex',
          first: 'BlockNumber',
          length: 'u32'
        },
        RewardInfo: {
          total_reward: 'Balance',
          claimed_reward: 'Balance'
        },
        RegistrationInfo: {
          account: 'AccountId',
          deposit: 'Balance'
        },
        ParachainBondConfig: {
          account: 'AccountId',
          deposit: 'Balance'
        },
        EthereumSignature: {
          r: 'H256',
          s: 'H256',
          v: 'U8'
        },
        ExitQ: {
          candidates: 'Vec<AccountId>',
          nominators_leaving: 'Vec<AccountId>',
          candidate_schedule: 'Vec<(AccountId, RoundIndex)>',
          nominator_schedule: 'Vec<(AccountId, Option<AccountId>, RoundIndex)>'
        }
      }
    }
  ]
} as OverrideBundleDefinition;

export default origintrailDefinitions;

export const typesBundle = {
  spec: {
    'origintrail-parachain': origintrailDefinitions
  }
} as OverrideBundleType;
