// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { TypeRegistry } from '@polkadot/types';
import { calcPassing } from '@polkadot/api-derive/democracy/util';

import { approxChanges } from './util';

const ACTUAL = {
  sqrtElectorate: new BN('2949443240'),
  votedAye: new BN('358406690000000000'),
  votedNay: new BN('18942000000000000'),
  votedTotal: new BN('136099900000000000')
};

const registry = new TypeRegistry();

function fmtBn (bn: BN): string {
  return bn.toString().padStart(20).substr(0, 8);
}

describe('approxChanges', (): void => {
  it('approximates where the points are', (): void => {
    const threshold = registry.createType('VoteThreshold', 0);

    console.time('approxChanges');

    const { changeAye, changeNay } = approxChanges(threshold, ACTUAL.sqrtElectorate, ACTUAL);

    console.timeEnd('approxChanges');

    console.error(
      '\n', 'changeAye', fmtBn(changeAye), fmtBn(ACTUAL.votedAye.sub(changeAye)),
      '\n', 'changeNay', fmtBn(changeNay), fmtBn(ACTUAL.votedNay.add(changeNay))
    );

    expect(
      calcPassing(threshold, ACTUAL.sqrtElectorate, { ...ACTUAL, votedAye: ACTUAL.votedAye.sub(changeAye) })
    ).toBe(false);
    expect(
      calcPassing(threshold, ACTUAL.sqrtElectorate, { ...ACTUAL, votedNay: ACTUAL.votedNay.add(changeNay) })
    ).toBe(false);
  });
});
