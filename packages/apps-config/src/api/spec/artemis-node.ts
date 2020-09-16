// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  Address: 'AccountId',
  LookupSource: 'AccountId',
  AppId: '[u8; 20]',
  Message: {
    payload: 'Vec<u8>',
    verification: 'VerificationInput'
  },
  VerificationInput: {
    _enum: {
      Basic: 'VerificationBasic',
      None: null
    }
  },
  VerificationBasic: {
    blockNumber: 'u64',
    eventIndex: 'u32'
  },
  TokenId: 'H160',
  BridgedAssetId: 'H160',
  AssetAccountData: {
    free: 'U256'
  }
};
