// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GovernanceTypes } from 'edgeware-node-types/dist/governance';
import { IdentityTypes } from 'edgeware-node-types/dist/identity';
import { VotingTypes } from 'edgeware-node-types/dist/voting';

export default {
  ...GovernanceTypes,
  ...IdentityTypes,
  ...VotingTypes
  // 'voting::TallyType': 'TallyType',
  // 'voting::VoteType': 'VoteType'
};
