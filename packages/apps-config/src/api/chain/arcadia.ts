// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default {
  Amendment: 'Call',
  Application: {
    candidate: 'AccountId',
    candidate_deposit: 'Balance',
    challenged_block: 'BlockNumber',
    challenger: 'Option<AccountId>',
    challenger_deposit: 'Option<Balance>',
    created_block: 'BlockNumber',
    metadata: 'Vec<u8>',
    voters_against: 'Vec<(AccountId, Balance)>',
    voters_for: 'Vec<(AccountId, Balance)>',
    votes_against: 'Option<Balance>',
    votes_for: 'Option<Balance>'
  },
  CertificateId: 'AccountId',
  RootCertificate: {
    child_revocations: 'Vec<CertificateId>',
    created: 'BlockNumber',
    key: 'CertificateId',
    owner: 'AccountId',
    renewed: 'BlockNumber',
    revoked: 'bool',
    validity: 'BlockNumber'
  }
};
