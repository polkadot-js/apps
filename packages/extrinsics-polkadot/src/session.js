// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseSection } from '@polkadot/extrinsics/types';

module.exports = ({
  description: 'Session',
  methods: {
    public: [
      {
        description: 'Set session key',
        index: 0,
        name: 'setKey',
        params: [
          { name: 'key', type: 'SessionKey' }
        ]
      }
    ],
    private: [
      {
        description: 'Set session length',
        index: 0,
        name: 'setLength',
        params: [
          { name: 'length', type: 'u64' }
        ]
      },
      {
        description: 'Force new session',
        index: 1,
        name: 'forceNewSession',
        params: []
      }
    ]
  }
}: ExtrinsicsBaseSection);
