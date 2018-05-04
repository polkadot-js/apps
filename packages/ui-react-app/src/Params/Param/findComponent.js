// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Type, Param$TypeArray } from '@polkadot/primitives/param';
import type { ComponentMap } from '../types';

import Account from './Account';
import Amount from './Amount';
import Bool from './Bool';
import Bytes from './Bytes';
import Hash from './Hash';
import Unknown from './Unknown';
import VoteThreshold from './VoteThreshold';
import Wasm from './Wasm';

const components: ComponentMap = {
  'AccountId': Account,
  'Balance': Amount,
  'BlockNumber': Amount,
  'bool': Bool,
  'Bytes': Bytes,
  'Digest': Bytes,
  'Hash': Hash,
  'Timestamp': Amount,
  'u32': Amount,
  'u64': Amount,
  'VoteThreshold': VoteThreshold,
  'Wasm': Wasm
};

export default function findComponent (type: Param$Type | Param$TypeArray, overrides?: ComponentMap = {}): React$ComponentType<*> | Array<React$ComponentType<*>> {
  if (Array.isArray(type)) {
    // $FlowFixMe we are ok here
    return type.map((type) =>
      findComponent(type, overrides)
    );
  }

  return overrides[type] || components[type] || Unknown;
}
