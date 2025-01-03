// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        GatewayVendor: { _enum: ['Substrate', 'Ethereum'] },
        GatewayType: {
          _enum: {
            ProgrammableInternal: 'u32',
            ProgrammableExternal: 'u32',
            TxOnly: 'u32'
          }
        },
        GatewayGenesisConfig: {
          modules_encoded: 'Option<Bytes>',
          extrinsics_version: 'u8',
          genesis_hash: 'Bytes'
        },
        GatewaySysProps: { ss58_format: 'u16', token_symbol: 'Bytes', token_decimals: 'u8' },
        AllowedSideEffect: '[u8; 4]',
        BlockNumber: 'u64',
        Compose: {
          name: 'Vec<u8>',
          code_txt: 'Vec<u8>',
          exec_type: 'Vec<u8>',
          dest: 'AccountId',
          value: 'Balance',
          bytes: 'Vec<u8>',
          input_data: 'Vec<u8>'
        },
        CircuitOutboundMessage: {
          name: 'Bytes',
          module_name: 'Bytes',
          method_name: 'Bytes',
          sender: 'Option<Bytes>',
          target: 'Option<Bytes>',
          arguments: 'Vec<Bytes>',
          expected_output: 'Vec<GatewayExpectedOutput>',
          extra_payload: 'Option<ExtraMessagePayload>'
        },
        GatewayExpectedOutput: {
          _enum: {
            Storage: null,
            Events: null,
            Extrinsic: null,
            Output: null
          }
        },
        ProofTriePointer: { _enum: { State: 0, Transaction: 1, Receipts: 2 } },
        GatewayPointer: {
          id: 'ChainId',
          vendor: 'GatewayVendor',
          gateway_type: 'GatewayType'
        },
        ExtraMessagePayload: {
          signer: 'Bytes',
          module_name: 'Bytes',
          method_name: 'Bytes',
          call_bytes: 'Bytes',
          signature: 'Bytes',
          extra: 'Bytes',
          tx_signed: 'Bytes',
          custom_payload: 'Option<Bytes>'
        },
        ContractActionDesc: {
          action_id: 'Hash',
          target_id: 'Option<TargetId>',
          to: 'Option<AccountId>'
        },
        TargetId: '[u8; 4]',
        SideEffect: {
          target: 'TargetId',
          prize: 'BalanceOf',
          ordered_at: 'BlockNumber',
          encoded_action: 'Bytes',
          encoded_args: 'Vec<Bytes>',
          signature: 'Bytes',
          enforce_executioner: 'Option<AccountId>'
        },
        SideEffectId: 'Hash',
        ConfirmedSideEffect: {
          err: 'Option<Bytes>',
          output: 'Option<Bytes>',
          encoded_effect: 'Bytes',
          inclusion_proof: 'Option<Bytes>',
          executioner: 'AccountId',
          received_at: 'BlockNumber',
          cost: 'Option<BalanceOf>'
        },
        FullSideEffect: { input: 'SideEffect', confirmed: 'Option<ConfirmedSideEffect>' },
        XtxId: 'Hash',
        XdnsRecordId: 'Hash',
        XdnsRecord: {
          url: 'Vec<u8>',
          gateway_abi: 'GatewayABIConfig',
          gateway_genesis: 'GatewayGenesisConfig',
          gateway_vendor: 'GatewayVendor',
          gateway_type: 'GatewayType',
          gateway_id: 'ChainId',
          gateway_sys_props: 'GatewaySysProps',
          registrant: 'Option<AccountId>',
          last_finalized: 'Option<u64>'
        },
        FetchXdnsRecordsResponse: { xdns_records: 'Vec<XdnsRecord<AccountId>>' },
        ChainId: '[u8; 4]',
        RegistryContractId: 'Hash',
        RegistryContract: {
          code_txt: 'Vec<u8>',
          bytes: 'Vec<u8>',
          author: 'AccountId',
          author_fees_per_single_use: 'Option<BalanceOf>',
          abi: 'Option<Vec<u8>>',
          action_descriptions: 'Vec<ContractActionDesc<Hash, ChainId, AccountId>>',
          info: 'Option<RawAliveContractInfo<Hash, BalanceOf, BlockNumber>>',
          meta: 'ContractMetadata'
        },
        RawAliveContractInfo: {
          trie_id: 'TrieId',
          storage_size: 'u32',
          pair_count: 'u32',
          code_hash: 'CodeHash',
          rent_allowance: 'Balance',
          rent_paid: 'Balance',
          deduct_block: 'BlockNumber',
          last_write: 'Option<BlockNumber>',
          _reserved: 'Option<()>'
        },
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        DispatchMessageId: { channelId: 'ChannelId', nonce: 'u64' },
        ChannelId: { _enum: ['Basic', 'Incentivized'] },
        MessageNonce: 'u64',
        Message: { data: 'Vec<u8>', proof: 'Proof' },
        Proof: {
          blockHash: 'H256',
          txIndex: 'u32',
          data: '(Vec<Vec<u8>>, Vec<Vec<u8>>)'
        },
        EthereumHeaderId: { number: 'u64', hash: 'H256' },
        EthereumHeader: {
          parentHash: 'H256',
          timestamp: 'u64',
          number: 'u64',
          author: 'H160',
          transactionsRoot: 'H256',
          ommersHash: 'H256',
          extraData: 'Vec<u8>',
          stateRoot: 'H256',
          receiptsRoot: 'H256',
          logBloom: 'Bloom',
          gasUsed: 'U256',
          gasLimit: 'U256',
          difficulty: 'U256',
          seal: 'Vec<Vec<u8>>',
          baseFee: 'Option<U256>'
        },
        StoredHeader: {
          submitter: 'Option<AccountId>',
          header: 'EthereumHeader',
          totalDifficulty: 'U256',
          finalized: 'bool'
        },
        EthashProofData: { dagNodes: '[H512; 2]', proof: 'Vec<H128>' },
        Bloom: '[u8; 256]',
        PruningRange: { oldestUnprunedBlock: 'u64', oldestBlockToKeep: 'u64' },
        EthereumDifficultyConfig: {
          byzantiumForkBlock: 'u64',
          constantinopleForkBlock: 'u64',
          muirGlacierForkBlock: 'u64',
          londonForkBlock: 'u64'
        },
        AssetId: { _enum: { ETH: null, Token: 'H160' } },
        TokenId: 'u128',
        TokenData: { tokenContract: 'H160', tokenId: 'U256' },
        TokenInfoOf: { owner: 'AccountId', metadata: 'Vec<u8>', data: 'TokenData' },
        GatewayABIConfig: {
          block_number_type_size: 'u16',
          hash_size: 'u16',
          hasher: 'HasherAlgo',
          crypto: 'CryptoAlgo',
          address_length: 'u16',
          value_type_size: 'u16',
          decimals: 'u16',
          structs: 'Vec<StructDecl>'
        },
        HasherAlgo: { _enum: ['Blake2', 'Keccak256'] },
        CryptoAlgo: { _enum: ['Ed25519', 'Sr25519', 'Ecdsa'] },
        StructDecl: { name: 'Type', fields: 'Vec<Parameter>', offsets: 'Vec<u16>' },
        Parachain: { relay_chain_id: 'ChainId', id: 'u32' }
      }
    }
  ]
};

export default definitions;
