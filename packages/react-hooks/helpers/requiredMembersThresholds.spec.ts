// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN_ZERO } from '@polkadot/util';

import { getAtLeastThresholdMembersCount, getMoreThanThresholdMembersCount } from './requiredMembersThresholds';

describe('minimal members count', () => {
  describe('treasury proposal threshold', () => {
    it('0 members', () => {
      expect(getAtLeastThresholdMembersCount(0, 0.6)).toEqual(BN_ZERO);
    });

    it('6 members - special case', () => {
      expect(getAtLeastThresholdMembersCount(6, 0.6).toNumber()).toEqual(4);
    });

    it('even number of members', () => {
      expect(getAtLeastThresholdMembersCount(12, 0.6).toNumber()).toEqual(8);
    });

    it('odd number of members', () => {
      expect(getAtLeastThresholdMembersCount(19, 0.6).toNumber()).toEqual(12);
    });
  });

  describe('reject origin threshold', () => {
    it('0 members', () => {
      expect(getMoreThanThresholdMembersCount(0, 0.5)).toEqual(BN_ZERO);
    });

    it('6 members - special case', () => {
      expect(getMoreThanThresholdMembersCount(6, 0.5).toNumber()).toEqual(4);
    });

    it('even number of members', () => {
      expect(getMoreThanThresholdMembersCount(12, 0.5).toNumber()).toEqual(7);
    });

    it('odd number of members', () => {
      expect(getMoreThanThresholdMembersCount(19, 0.5).toNumber()).toEqual(10);
    });
  });
});
