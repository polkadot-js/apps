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
      }
    }
  ]
};

export default definitions;
