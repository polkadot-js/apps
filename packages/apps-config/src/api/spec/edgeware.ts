// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// structs need to be in order
/* eslint-disable sort-keys */

import * as edgewareDefinitions from 'edgeware-node-types/interfaces/definitions';

const edgTypes = Object
  .values(edgewareDefinitions)
  .reduce((res, { types }) => ({ ...res, ...types }), {});

export default {
  ...edgTypes,
  // aliases that don't do well as part of interfaces
  'voting::VoteType': 'VoteType',
  'voting::TallyType': 'TallyType',
  'voting::Tally': 'VotingTally',
  // chain-specific overrides
  Address: 'GenericAddress',
  Keys: 'SessionKeys4',
  StakingLedger: 'StakingLedgerTo223',
  Votes: 'VotesTo230',
  ReferendumInfo: 'ReferendumInfoTo239',
  Weight: 'u32'
};
