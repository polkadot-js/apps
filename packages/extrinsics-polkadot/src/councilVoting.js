// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseSection } from '@polkadot/extrinsics/types';

module.exports = ({
  description: 'Council Voting',
  methods: {
    public: [
      {
        description: 'Propose',
        name: 'propose',
        index: 0,
        params: [
          { name: 'proposal', type: 'Proposal' }
        ]
      },
      {
        description: 'Vote',
        name: 'vote',
        index: 1,
        params: [
          { name: 'proposal', type: 'Hash' },
          { name: 'approve', type: 'bool' }
        ]
      },
      {
        description: 'Veto',
        name: 'veto',
        index: 2,
        params: [
          { name: 'proposal', type: 'Hash' }
        ]
      }
    ],
    private: [
      {
        description: 'Set cooloff period',
        name: 'setCooloffPeriod',
        index: 0,
        params: [
          { name: 'blocks', type: 'BlockNumber' }
        ]
      },
      {
        description: 'Set voting period',
        name: 'setVotingPeriod',
        index: 1,
        params: [
          { name: 'blocks', type: 'BlockNumber' }
        ]
      }
    ]
  }
}: ExtrinsicsBaseSection);
