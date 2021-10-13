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
          metadata: 'Vec<u8>',
          challenger: 'Option<AccountId>',
          challenger_deposit: 'Balance',
          votes_for: 'Balance',
          voters_for: 'Vec<(AccountId, Balance)>',
          votes_against: 'Balance',
          voters_against: 'Vec<(AccountId, Balance)>',
          created_block: 'BlockNumber',
          challenged_block: 'BlockNumber'
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
        },
        VestingSchedule: {
          start: 'BlockNumber',
          period: 'BlockNumber',
          period_count: 'u32',
          per_period: 'Balance'
        },
        ListVestingScheduleOf: 'Vec<VestingScheduleOf>',
        VestingScheduleOf: 'VestingSchedule'
      }
    }
  ]
};

export default definitions;
