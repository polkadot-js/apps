// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentMap } from '@polkadot/ui-app/Params/types';

import Account from './Account';
import Call from './Call';
import Proposal from './Proposal';

const components: ComponentMap = {
  'AccountId': Account,
  'Call': Call,
  'Proposal': Proposal
};

export default components;
