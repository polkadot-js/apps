// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseSection } from '@polkadot/extrinsics/types';

module.exports = ({
  description: 'Council Voting',
  methods: {
    public: {
      propose: {
        description: 'Propose',
        index: 0,
        params: {
          proposal: { type: 'Proposal' }
        }
      },
      vote: {
        description: 'Vote',
        index: 1,
        params: {
          proposal: { type: 'Hash' },
          approve: { type: 'bool' }
        }
      },
      veto: {
        description: 'Veto',
        index: 2,
        params: {
          proposal: { type: 'Hash' }
        }
      }
    },
    private: {
      setCooloffPeriod: {
        description: 'Set cooloff period',
        index: 0,
        params: {
          blocks: { type: 'BlockNumber' }
        }
      },
      setVotingPeriod: {
        description: 'Set voting period',
        index: 1,
        params: {
          blocks: { type: 'BlockNumber' }
        }
      }
    }
  }
}: ExtrinsicsBaseSection);
