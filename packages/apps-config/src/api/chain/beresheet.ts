// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

import * as edgewareDefinitions from '@edgeware/node-types/dist/interfaces/definitions';

const edgTypes = Object
  .values(edgewareDefinitions)
  .reduce((res, { types }) => ({ ...res, ...types }), {});

export default {
  ...edgTypes,
  // aliases that don't do well as part of interfaces
  'voting::VoteType': 'VoteType',
  'voting::TallyType': 'TallyType',
  'voting::Tally': 'VotingTally',
  // Substrate overrides
  Weight: 'u64'
};
