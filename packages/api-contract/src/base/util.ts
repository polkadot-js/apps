// Copyright 2017-2020 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableResult } from '@polkadot/api';
import { EventRecord } from '@polkadot/types/interfaces';

export function applyOnEvent <T> (result: SubmittableResult, type: 'CodeStored' | 'Instantiated', fn: (record: EventRecord) => T): T | undefined {
  if (result.isInBlock || result.isFinalized) {
    const record = result.findRecord('contract', 'CodeStored');

    if (record) {
      return fn(record);
    }
  }

  return undefined;
}
