// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseSection } from '@polkadot/extrinsics/types';

module.exports = ({
  description: 'Consensus',
  methods: {
    public: [
      {
        description: 'Report misbehavior',
        index: 0,
        name: 'reportMisbehavior',
        params: [
          { name: 'report', type: 'MisbehaviorReport' }
        ]
      }
    ],
    private: [
      {
        description: 'Set new code',
        index: 0,
        name: 'setCode',
        params: [
          { name: 'code', type: 'Bytes' }
        ]
      }
    ]
  }
}: ExtrinsicsBaseSection);
