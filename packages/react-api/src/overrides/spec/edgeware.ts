// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IdentityTypes } from 'edgeware-node-types/dist/identity';
import { SignalingTypes } from 'edgeware-node-types/dist/signaling';
import { TreasuryRewardTypes } from 'edgeware-node-types/dist/treasuryReward';
import { VotingTypes } from 'edgeware-node-types/dist/voting';

export default {
  ...IdentityTypes,
  ...SignalingTypes,
  ...TreasuryRewardTypes,
  ...VotingTypes
};
