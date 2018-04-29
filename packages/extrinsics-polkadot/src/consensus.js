// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseSection } from '@polkadot/extrinsics/types';

module.exports = ({
  description: 'Consensus',
  methods: {
    public: {
      reportMisbehavior: {
        description: 'Report misbehavior',
        index: 0,
        params: {
          report: { type: 'MisbehaviorReport' }
        }
      }
    },
    private: {
      setCode: {
        description: 'Set new code',
        index: 0,
        params: {
          code: { type: 'Bytes' }
        }
      }
    }
  }
}: ExtrinsicsBaseSection);
