// Copyright 2017-2023 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ComponentMap } from '@polkadot/react-params/types';

import Call from './Call.js';
import OpaqueCall from './OpaqueCall.js';
import Proposal from './Proposal.js';

const components: ComponentMap = {
  Call,
  OpaqueCall,
  Proposal,
  RuntimeCall: Call
};

export default components;
