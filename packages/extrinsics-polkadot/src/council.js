// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseSection } from '@polkadot/extrinsics/types';

module.exports = ({
  description: 'Council',
  methods: {
    public: {
      setApprovals: {
        description: 'Set approvals',
        index: 0,
        params: {
          votes: { type: ['Array', 'bool'] },
          index: { type: 'u32' }
        }
      },
      reapInactiveVoter: {
        description: 'Remove insactive voter',
        index: 1,
        params: {
          signedIndex: { type: 'u32' },
          who: { type: 'AccountId' },
          whoIndex: { type: 'u32' },
          assumedVoteIndex: { type: 'u32' }
        }
      },
      retractVoter: {
        description: 'Retract voter',
        index: 2,
        params: {
          index: { type: 'u32' }
        }
      },
      submitCandidacy: {
        description: 'Submit candidacy',
        index: 3,
        params: {
          slot: { type: 'u32' }
        }
      },
      presentWinner: {
        description: 'Present winner',
        index: 4,
        params: {
          candidate: { type: 'AccountId' },
          total: { type: 'Balance' },
          index: { type: 'u32' }
        }
      }
    },
    private: {
      setDesiredSeats: {
        description: 'Set desired seats',
        index: 0,
        params: {
          count: { type: 'u32' }
        }
      },
      removeMember: {
        description: 'Remove member',
        index: 1,
        params: {
          member: { type: 'AccountId' }
        }
      },
      setPresentationDuration: {
        description: 'Set presentation duration',
        index: 2,
        params: {
          duration: { type: 'u64' }
        }
      },
      setTermDuration: {
        description: 'Set term duration',
        index: 3,
        params: {
          duration: { type: 'u64' }
        }
      }
    }
  }
}: ExtrinsicsBaseSection);
