// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseSection } from '@polkadot/extrinsics/types';

module.exports = ({
  description: 'Council',
  methods: {
    public: [
      {
        description: 'Set approvals',
        name: 'setApprovals',
        index: 0,
        params: [
          { name: 'votes', type: ['Array', 'bool'] },
          { name: 'index', type: 'u32' }
        ]
      },
      {
        description: 'Remove insactive voter',
        name: 'reapInactiveVoter',
        index: 1,
        params: [
          { name: 'signedIndex', type: 'u32' },
          { name: 'who', type: 'AccountId' },
          { name: 'whoIndex', type: 'u32' },
          { name: 'assumedVoteIndex', type: 'u32' }
        ]
      },
      {
        description: 'Retract voter',
        name: 'retractVoter',
        index: 2,
        params: [
          { name: 'index', type: 'u32' }
        ]
      },
      {
        description: 'Submit candidacy',
        name: 'submitCandidacy',
        index: 3,
        params: [
          { name: 'slot', type: 'u32' }
        ]
      },
      {
        description: 'Present winner',
        name: 'presentWinner',
        index: 4,
        params: [
          { name: 'candidate', type: 'AccountId' },
          { name: 'total', type: 'Balance' },
          { name: 'index', type: 'u32' }
        ]
      }
    ],
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
