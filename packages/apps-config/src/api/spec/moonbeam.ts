// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  AccountId: 'EthereumAccountId',
  Address: 'AccountId',
  Balance: 'u128',
  RefCount: 'u8',
  LookupSource: 'AccountId',
  Account: {
    nonce: 'U256',
    balance: 'u128'
  },
  TransactionCondition: {
    _enum: {
      block: 'u64',
      time: 'u64'
    }
  },
  Transaction: {
    block_hash: 'Option<H256>',
    block_number: 'Option<U256>',
    chain_id: 'Option<u64>',
    condition: 'Option<TransactionCondition>',
    creates: 'Option<H160>',
    from: 'H160',
    gas: 'U256',
    gas_price: 'U256',
    hash: 'H256',
    input: 'Bytes',
    nonce: 'U256',
    public_key: 'Option<H512>',
    r: 'U256',
    raw: 'Bytes',
    standard_v: 'U256',
    to: 'Option<H160>',
    transaction_index: 'Option<U256>',
    v: 'U256',
    value: 'U256'
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
  Receipt: {
    transaction_hash: 'Option<H256>',
    transaction_index: 'Option<U256>',
    block_hash: 'Option<H256>',
    from: 'Option<H160>',
    to: 'Option<H160>',
    block_number: 'Option<U256>',
    cumulative_gas_used: 'U256',
    gas_used: 'Option<U256>',
    contract_address: 'Option<H160>',
    logs: 'Vec<Log>',
    state_root: 'Option<H256>',
    logs_bloom: 'H2048',
    status_code: 'Option<U64>'
  },
  ExitReason: { _enum: {
    ExitSucceed: 'bool',
    ExitError: 'bool',
    ExitRevert: 'bool',
    ExitFatal: 'bool'
  } }
};
