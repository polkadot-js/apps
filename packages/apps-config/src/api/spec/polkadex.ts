// Copyright 2017-2025 @polkadot/apps-config authors & contributors
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
        BurnTxDetails: {
          approvals: 'u32',
          approvers: 'Vec<AccountId>'
        },
        OrmlVestingSchedule: {
          start: 'BlockNumber',
          period: 'BlockNumber',
          periodCount: 'u32',
          perPeriod: 'Compact<Balance>'
        },
        VestingScheduleOf: 'OrmlVestingSchedule'
      }
    }
  ]
};

export default definitions;
