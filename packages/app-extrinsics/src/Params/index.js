// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ComponentMap } from '@polkadot/ui-app/Params/types';

import Account from './Account';
import Proposal from './Proposal';

const components: ComponentMap = {
  'AccountId': Account,
  'Proposal': Proposal
};

export default components;
