// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default {
  AuthorityId: 'AccountId',
  AuthorityVote: 'u32',
  Claim: {
    amount: 'u128',
    approve: 'BTreeSet<AuthorityId>',
    complete: 'bool',
    decline: 'BTreeSet<AuthorityId>',
    params: 'Lockdrop'
  },
  ClaimId: 'H256',
  ClaimVote: {
    approve: 'bool',
    authority: 'u16',
    claim_id: 'ClaimId'
  },
  DollarRate: 'u128',
  Keys: 'SessionKeys2',
  Lockdrop: {
    duration: 'u64',
    public_key: '[u8; 33]',
    transaction_hash: 'H256',
    type: 'u8',
    value: 'u128'
  },
  PredicateHash: 'H256',
  TickerRate: {
    authority: 'u16',
    btc: 'u128',
    eth: 'u128'
  }
};
