// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseSection } from '@polkadot/extrinsics/types';

module.exports = ({
  description: 'Democracy',
  methods: {
    public: [
      {
        description: 'Propose',
        index: 0,
        name: 'propose',
        params: [
          { name: 'proposal', type: 'Proposal' },
          { name: 'value', type: 'Balance' }
        ]
      },
      {
        description: 'Second',
        index: 1,
        name: 'second',
        params: [
          { name: 'proposal', type: 'u32' }
        ]
      },
      {
        description: 'Vote',
        index: 2,
        name: 'vote',
        params: [
          { name: 'referendumIndex', type: 'u32' },
          { name: 'vote', type: 'bool' }
        ]
      }
    ],
    private: [
      {
        description: 'Start referendum',
        index: 0,
        name: 'startReferendum',
        params: [
          { name: 'proposal', type: 'Proposal' },
          { name: 'VoteThreshold', type: 'VoteThreshold', options: { initValue: 0 } }
        ]
      },
      {
        description: 'Cancel referendum',
        index: 1,
        name: 'cancelReferendum',
        params: [
          { name: 'referendumIndex', type: 'u32' }
        ]
      }
    ]
  }
}: ExtrinsicsBaseSection);
