// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EdgewareTypes } from 'edgeware-node-types/dist';

export default {
  ...EdgewareTypes,
  Address: 'GenericAddress',
  BalanceLock: 'BalanceLockTo212',
  Keys: 'SessionKeys4',
  StakingLedger: 'StakingLedgerTo223'
};
