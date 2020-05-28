// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default {
  CertificateId: "AccountId",
  Application: {
    candidate: "AccountId",
    candidate_deposit: "Balance",
    metadata: "Vec<u8>",
    challenger: "Option<AccountId>",
    challenger_deposit: "Option<Balance>",
    votes_for: "Option<Balance>",
    voters_for: "Vec<(AccountId, Balance)>",
    votes_against: "Option<Balance>",
    voters_against: "Vec<(AccountId, Balance)>",
    created_block: "BlockNumber",
    challenged_block: "BlockNumber"
  },
  RootCertificate: {
    owner: "AccountId",
    key: "CertificateId",
    created: "BlockNumber",
    renewed: "BlockNumber",
    revoked: "bool",
    validity: "BlockNumber",
    child_revocations: "Vec<CertificateId>"
  },
  Amendment: "Call"
};