// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseSection } from '@polkadot/extrinsics/types';

module.exports = ({
  description: 'Democracy',
  methods: {
    public: {
      propose: {
        description: 'Propose',
        index: 0,
        params: {
          proposal: { type: 'Proposal' },
          value: { type: 'Balance' }
        }
      },
      second: {
        description: 'Second',
        index: 1,
        params: {
          proposal: { type: 'u32' }
        }
      },
      vote: {
        description: 'Vote',
        index: 2,
        params: {
          referendumIndex: { type: 'u32' },
          vote: { type: 'bool' }
        }
      }
    },
    private: {
      startReferendum: {
        description: 'Start referendum',
        index: 0,
        params: {
          proposal: { type: 'Proposal' },
          voteThreshold: { type: 'VoteThreshold' }
        }
      },
      cancelReferendum: {
        description: 'Cancel referendum',
        index: 1,
        params: {
          referendumIndex: { type: 'u32' }
        }
      }
    }
  }
}: ExtrinsicsBaseSection);
