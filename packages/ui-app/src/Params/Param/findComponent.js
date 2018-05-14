// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Types } from '@polkadot/params/types';
import type { ComponentMap } from '../types';

import Account from './Account';
import Amount from './Amount';
import Bool from './Bool';
import Bytes from './Bytes';
import Code from './Code';
import Hash from './Hash';
import KeyValue from './KeyValue';
import Unknown from './Unknown';
import VoteThreshold from './VoteThreshold';

const components: ComponentMap = {
  'AccountId': Account,
  'Balance': Amount,
  'BlockNumber': Amount,
  'bool': Bool,
  'Bytes': Bytes,
  'Code': Code,
  'Call': Unknown,
  'Digest': Unknown,
  'Hash': Hash,
  'Index': Amount,
  'KeyValue': KeyValue,
  'MisbehaviorReport': Unknown,
  'PropIndex': Amount,
  'Proposal': Unknown,
  'ReferendumIndex': Amount,
  'SessionKey': Amount,
  'Signature': Hash,
  'Timestamp': Amount,
  'u32': Amount,
  'u64': Amount,
  'VoteIndex': Amount,
  'VoteThreshold': VoteThreshold
};

export default function findComponent (type: Param$Types, overrides?: ComponentMap = {}): React$ComponentType<*> | Array<React$ComponentType<*>> {
  if (Array.isArray(type)) {
    return type
      .map((type) =>
        // $FlowFixMe running out of options to check the embedded arrays
        findComponent(type, overrides)
      );
  }

  return overrides[type] || components[type] || Unknown;
}
