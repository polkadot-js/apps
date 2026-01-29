// Copyright 2017-2025 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ComponentMap } from '../types.js';

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
