// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBasic } from './types';

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
      }
    ],
    private: []
  }
}: ExtrinsicsBasic);
