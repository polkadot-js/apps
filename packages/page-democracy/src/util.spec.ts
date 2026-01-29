// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import { calcPassing } from '@polkadot/api-derive/democracy/util';
import { TypeRegistry } from '@polkadot/types/create';
import { BN } from '@polkadot/util';

import { approxChanges } from './util.js';

const ACTUAL = {
  sqrtElectorate: new BN('2949443240'),
  votedAye: new BN('358406690000000000'),
  votedNay: new BN('18942000000000000'),
  votedTotal: new BN('136099900000000000')
};

const registry = new TypeRegistry();

describe('approxChanges', (): void => {
  it('approximates where the points are', (): void => {
    const threshold = registry.createType('VoteThreshold', 0);
    const { changeAye, changeNay } = approxChanges(threshold, ACTUAL.sqrtElectorate, ACTUAL);

    expect(
      calcPassing(threshold, ACTUAL.sqrtElectorate, { ...ACTUAL, votedAye: ACTUAL.votedAye.sub(changeAye) })
    ).toBe(false);
    expect(
      calcPassing(threshold, ACTUAL.sqrtElectorate, { ...ACTUAL, votedNay: ACTUAL.votedNay.add(changeNay) })
    ).toBe(false);
  });
});
