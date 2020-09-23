// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
  RefCount: 'u8',
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
