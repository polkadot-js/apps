// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ComponentMap } from '@polkadot/ui-app/Params/types';

import Account from './Account';
import Call from './Call';
import Proposal from './Proposal';

const components: $Shape<ComponentMap> = {
  'AccountId': Account,
  'Call': Call,
  'Proposal': Proposal
};

export default components;
