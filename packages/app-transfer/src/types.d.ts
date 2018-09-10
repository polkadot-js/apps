// Copyright 2017-2018 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';

export type Fees = {
  hasAvailable: boolean,
  isCreation: boolean,
  isNoEffect: boolean,
  isRemovable: boolean,
  isReserved: boolean,
  txfees: BN,
  txtotal: BN
};
