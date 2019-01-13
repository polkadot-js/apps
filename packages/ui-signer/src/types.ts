// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export type Signed = {
  data: Uint8Array,
  message: Uint8Array,
  signature: Uint8Array
};

export type Fees = {
  hasAvailable: boolean,
  isCreation: boolean,
  isNoEffect: boolean,
  isRemovable: boolean,
  isReserved: boolean,
  txfees: BN,
  txtotal: BN
};
