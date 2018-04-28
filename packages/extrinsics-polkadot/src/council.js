// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseSection } from '@polkadot/extrinsics/types';

module.exports = ({
  description: 'Council',
  methods: {
    public: [],
    private: [
      {
        description: 'Set desired seats',
        index: 0,
        name: 'setDesiredSeats',
        params: [
          { name: 'count', type: 'u32' }
        ]
      },
      {
        description: 'Remove member',
        index: 1,
        name: 'removeMember',
        params: [
          { name: 'member', type: 'AccountId' }
        ]
      },
      {
        description: 'Set presentation duration',
        index: 2,
        name: 'setPresentationDuration',
        params: [
          { name: 'duration', type: 'u64' }
        ]
      },
      {
        description: 'Set term duration',
        index: 3,
        name: 'setTermDuration',
        params: [
          { name: 'duration', type: 'u64' }
        ]
      }
    ]
  }
}: ExtrinsicsBaseSection);
