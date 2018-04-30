// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Type } from '@polkadot/extrinsics/types';

import Account from './Param/Account';
import Amount from './Param/Amount';
import Bool from './Param/Bool';
import Bytes from './Param/Bytes';
import Hash from './Param/Hash';
import Proposal from './Param/Proposal';
import Unknown from './Param/Unknown';
import VoteThreshold from './Param/VoteThreshold';
import Wasm from './Param/Wasm';

const Components = {
  'AccountId': Account,
  'Balance': Amount,
  'BlockNumber': Amount,
  'bool': Bool,
  'Bytes': Bytes,
  'Hash': Hash,
  'MisbehaviorReport': Unknown,
  'Proposal': Proposal,
  'SessionKey': Unknown,
  'u32': Amount,
  'u64': Amount,
  'VoteThreshold': VoteThreshold,
  'Wasm': Wasm
};

export default function findComponent (type: Extrinsic$Type): React$ComponentType<*> {
  if (Array.isArray(type)) {
    // eslint-disable-next-line no-unused-vars
    const [outer, inner] = type;

    return findComponent(inner);
  }

  return Components[type];
}
