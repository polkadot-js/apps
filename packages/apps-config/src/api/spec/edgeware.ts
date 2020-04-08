// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import signaling from 'edgeware-node-types/dist/signaling/definitions';
import treasuryRewards from 'edgeware-node-types/dist/treasuryRewards/definitions';
import voting from 'edgeware-node-types/dist//voting/definitions';

import { typesFromDefs } from '../util';

export default {
  ...typesFromDefs({ signaling, treasuryRewards, voting }),
  Address: 'GenericAddress',
  Keys: 'SessionKeys4',
  // previous substrate versions
  ReferendumInfo: 'ReferendumInfoTo239',
  StakingLedger: 'StakingLedgerTo223'
};
