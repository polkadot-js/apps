// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default {
  rpc: {
    alephNode: {
      emergencyFinalize: {
        description: 'Finalize the block with given hash and number using attached signature. Returns the empty string or an error.',
        params: [
          {
            name: 'justification',
            type: 'Bytes'
          },
          {
            name: 'hash',
            type: 'BlockHash'
          },
          {
            name: 'number',
            type: 'BlockNumber'
          }
        ],
        type: 'Null'
      }
    }
  }
};
