// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EdgewareTypes } from 'edgeware-node-types/dist';

export default {
  ...EdgewareTypes,
  Address: 'GenericAddress',
  Keys: 'SessionKeys4',
  // previous substrate versions
  ReferendumInfo: 'ReferendumInfoTo239',
  StakingLedger: 'StakingLedgerTo223'
};
