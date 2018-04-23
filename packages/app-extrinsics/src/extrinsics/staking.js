// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBasic } from './types';

module.exports = ({
  description: 'Staking',
  methods: {
    transfer: {
      description: 'Transfer',
      index: 0,
      params: ['AccountId', 'Balance']
    },
    stake: {
      description: 'Stake',
      index: 1,
      params: []
    },
    unstake: {
      description: 'Unstake',
      index: 2,
      params: []
    }
  }
}: ExtrinsicsBasic);
