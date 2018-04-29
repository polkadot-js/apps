// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseSection } from '@polkadot/extrinsics/types';

module.exports = ({
  description: 'Session',
  methods: {
    public: {
      setKey: {
        description: 'Set session key',
        index: 0,
        params: {
          key: { type: 'SessionKey' }
        }
      }
    },
    private: {
      setLength: {
        description: 'Set session length',
        index: 0,
        params: {
          length: { type: 'u64' }
        }
      },
      forceNewSession: {
        description: 'Force new session',
        index: 1,
        params: {}
      }
    }
  }
}: ExtrinsicsBaseSection);
