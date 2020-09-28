// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  Address: 'AccountId',
  LookupSource: 'AccountId',
  RefCount: 'u8',
  BalanceLock: {
    id: 'LockIdentifier',
    lock_for: 'LockFor',
    lock_reasons: 'LockReasons',
    amount: 'Balance',
    reasons: 'Reasons'
  },
  LockFor: {
    _enum: {
      Common: 'Common',
      Staking: 'StakingLock'
    }
  },
  Common: {
    amount: 'Balance'
  },
  StakingLock: {
    staking_amount: 'Balance',
    unbondings: 'Vec<Unbonding>'
  },
  LockReasons: {
    _enum: {
      Fee: null,
      Misc: null,
      All: null
    }
  },
  Unbonding: {
    amount: 'Balance',
    until: 'BlockNumber'
  },
  AccountData: {
    free: 'Balance',
    reserved: 'Balance',
    free_kton: 'Balance',
    reserved_kton: 'Balance',
    misc_frozen: 'Balance',
    fee_frozen: 'Balance'
  },
  RingBalance: 'Balance',
  KtonBalance: 'Balance',
  TsInMs: 'u64',
  Power: 'u32',
  DepositId: 'U256',
  StakingBalanceT: {
    _enum: {
      RingBalance: 'Balance',
      KtonBalance: 'Balance'
    }
  },
  StakingLedgerT: {
    stash: 'AccountId',
    active_ring: 'Compact<Balance>',
    active_deposit_ring: 'Compact<Balance>',
    active_kton: 'Compact<Balance>',
    deposit_items: 'Vec<TimeDepositItem>',
    ring_staking_lock: 'StakingLock',
    kton_staking_lock: 'StakingLock',
    claimed_rewards: 'Vec<EraIndex>',
    total: 'Compact<Balance>',
    active: 'Compact<Balance>',
    unlocking: 'Vec<UnlockChunk>'
  },
  TimeDepositItem: {
    value: 'Compact<Balance>',
    start_time: 'Compact<TsInMs>',
    expire_time: 'Compact<TsInMs>'
  },
  RewardDestination: {
    _enum: {
      Staked: 'Staked',
      Stash: null,
      Controller: null
    }
  },
  Staked: {
    promise_month: 'u8'
  },
  ExposureT: {
    own_ring_balance: 'Compact<Balance>',
    own_kton_balance: 'Compact<Balance>',
    own_power: 'Power',
    total_power: 'Power',
    others: 'Vec<IndividualExposure>'
  },
  IndividualExposure: {
    who: 'AccountId',
    ring_balance: 'Compact<Balance>',
    kton_balance: 'Compact<Balance>',
    power: 'Power'
    // not in https://github.com/darwinia-network/darwinia-common/blob/master/frame/staking/src/lib.rs
    // value: 'Compact<Balance>'
  },
  ElectionResultT: {
    elected_stashes: 'Vec<AccountId>',
    exposures: 'Vec<(AccountId, ExposureT)>',
    compute: 'ElectionCompute'
  },
  RKT: {
    r: 'Balance',
    k: 'Balance'
  },
  SpanRecord: {
    slashed: 'RKT',
    paid_out: 'RKT'
  },
  UnappliedSlash: {
    validator: 'AccountId',
    own: 'RKT',
    others: 'Vec<(AccountId, RKT)>',
    reporters: 'Vec<AccountId>',
    payout: 'RKT'
  },
  TreasuryProposal: {
    proposer: 'AccountId',
    beneficiary: 'AccountId',
    ring_value: 'Balance',
    kton_value: 'Balance',
    ring_bond: 'Balance',
    kton_bond: 'Balance'
  },
  MappedRing: 'u128',
  EthereumTransactionIndex: '(H256, u64)',
  EthereumHeaderBrief: {
    total_difficulty: 'U256',
    parent_hash: 'H256',
    number: 'EthereumBlockNumber',
    relayer: 'AccountId'
  },
  EthereumBlockNumber: 'u64',
  EthereumHeaderThingWithProof: {
    header: 'EthereumHeader',
    ethash_proof: 'Vec<EthashProof>',
    mmr_root: 'H256',
    mmr_proof: 'Vec<H256>'
  },
  ConfirmedEthereumHeaderInfo: {
    header: 'EthereumHeader',
    mmr_root: 'H256'
  },
  EthereumHeaderThing: {
    header: 'EthereumHeader',
    mmr_root: 'H256'
  },
  EthereumHeader: {
    parent_hash: 'H256',
    timestamp: 'u64',
    number: 'EthereumBlockNumber',
    author: 'EthereumAddress',
    transactions_root: 'H256',
    uncles_hash: 'H256',
    extra_data: 'Bytes',
    state_root: 'H256',
    receipts_root: 'H256',
    log_bloom: 'Bloom',
    gas_used: 'U256',
    gas_limit: 'U256',
    difficulty: 'U256',
    seal: 'Vec<Bytes>',
    hash: 'Option<H256>'
  },
  EthereumAddress: 'H160',
  Bloom: '[u8; 256; Bloom]',
  H128: '[u8; 16; H128]',
  EthashProof: {
    dag_nodes: '(H512, H512)',
    proof: 'Vec<H128>'
  },
  EthereumReceipt: {
    gas_used: 'U256',
    log_bloom: 'Bloom',
    logs: 'Vec<LogEntry>',
    outcome: 'TransactionOutcome'
  },
  EthereumNetworkType: {
    _enum: {
      Mainnet: null,
      Ropsten: null
    }
  },
  RedeemFor: {
    _enum: {
      Token: null,
      Deposit: null
    }
  },
  EthereumReceiptProof: {
    index: 'u64',
    proof: 'Bytes',
    header_hash: 'H256'
  },
  EthereumReceiptProofThing: '(EthereumHeader, EthereumReceiptProof, MMRProof)',
  MMRProof: {
    member_leaf_index: 'u64',
    last_leaf_index: 'u64',
    proof: 'Vec<H256>'
  },
  OtherSignature: {
    _enum: {
      Eth: 'EcdsaSignature',
      Tron: 'EcdsaSignature'
    }
  },
  EcdsaSignature: '[u8; 65; EcdsaSignature]',
  OtherAddress: {
    _enum: {
      Eth: '[u8; 20; EthereumAddress]',
      Tron: '[u8; 20; TronAddress]'
    }
  },
  AddressT: '[u8; 20; AddressT]',
  MerkleMountainRangeRootLog: {
    prefix: '[u8; 4; Prefix]',
    mmr_root: 'Hash'
  },
  Round: 'u64',
  TcHeaderThingWithProof: 'EthereumHeaderThingWithProof',
  TcHeaderThing: 'EthereumHeaderThing',
  TcBlockNumber: 'u64',
  TcHeaderHash: 'H256',
  GameId: 'TcBlockNumber',
  RelayProposalT: {
    relayer: 'AccountId',
    bonded_proposal: 'Vec<(Balance, TcHeaderThing)>',
    extend_from_header_hash: 'Option<TcHeaderHash>'
  },
  BalancesRuntimeDispatchInfo: {
    usable_balance: 'Balance'
  },
  StakingRuntimeDispatchInfo: {
    power: 'Power'
  }
};
