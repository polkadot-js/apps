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
        Rarity: {
          _enum: [
            'Common',
            'Uncommon',
            'Rare',
            'Mythical',
            'Legendary'
          ]
        },
        Socket: {
          _enum: [
            'Head',
            'Body',
            'LegLeft',
            'LegRight',
            'ArmLeft',
            'ArmRight',
            'Weapon'
          ]
        },
        Params: {
          strength: 'u8',
          agility: 'u8',
          intelligence: 'u8'
        },
        Token: {
          rarity: 'Rarity',
          socket: 'Socket',
          params: 'Params'
        },
        AttributeTransaction: {
          signature: 'Signature',
          name: 'Vec<u8>',
          value: 'Vec<u8>',
          validity: 'u32',
          signer: 'AccountId',
          identity: 'AccountId'
        },
        Attribute: {
          name: 'Vec<u8>',
          value: 'Vec<u8>',
          validity: 'BlockNumber',
          creation: 'Moment',
          nonce: 'u64'
        },
        SocialTokenBalance: 'u128',
        RegistrarIndex: 'u32',
        Judgement: {
          _enum: [
            'Requested',
            'Approved'
          ]
        },
        Registration: {
          judgements: 'Vec<JudgementItem>',
          account_id: 'AccountId'
        },
        Bloom: 'H256',
        Log: {
          address: 'H160',
          topics: 'Vec<H256>',
          data: 'Bytes'
        },
        Receipt: {
          state_root: 'H256',
          used_gas: 'U256',
          logs_bloom: 'Bloom',
          logs: 'Vec<Log>'
        },
        TransactionAction: {
          _enum: {
            Call: 'H160',
            Create: 'Null'
          }
        },
        TransactionRecoveryId: 'u64',
        TransactionSignature: {
          v: 'TransactionRecoveryId',
          r: 'H256',
          s: 'H256'
        },
        Transaction: {
          nonce: 'U256',
          gas_price: 'U256',
          gas_limit: 'U256',
          action: 'TransactionAction',
          value: 'U256',
          input: 'Bytes',
          signature: 'TransactionSignature'
        },
        TransactionStatus: {
          transaction_hash: 'H256',
          transaction_index: 'u32',
          from: 'H160',
          to: 'Option<H160>',
          contract_address: 'Option<H160>',
          logs: 'Vec<Log>',
          logs_bloom: 'Bloom'
        },
        Id: 'AuthorityId',
        ChainId: 'u8',
        ResourceId: 'Vec<u8>',
        ExchangeId: 'u64',
        CurrencyOf: 'Balance',
        TokenId: 'U256',
        RealisTokenId: 'u32',
        Erc721Token: {
          id: 'NftId'
        }
      }
    }
  ]
};

export default definitions;
