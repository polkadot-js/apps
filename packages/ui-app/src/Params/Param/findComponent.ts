// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TypeDef, TypeDefInfo } from '@polkadot/types/codec';
import { Props, ComponentMap } from '../types';

import Account from './Account';
import Amount from './Amount';
import Balance from './Balance';
import Bool from './Bool';
import Bytes from './Bytes';
import Code from './Code';
import Hash from './Hash';
import Proposal from './Proposal';
import KeyValue from './KeyValue';
import KeyValueArray from './KeyValueArray';
import StringParam from './String';
import Timestamp from './Timestamp';
import Unknown from './Unknown';
import VoteThreshold from './VoteThreshold';

const components: ComponentMap = {
  'AccountId': Account,
  'AccountIndex': Account,
  'Address': Account,
  'Balance': Balance,
  'BlockNumber': Amount,
  'bool': Bool,
  'Bytes': Bytes,
  'Code': Code,
  'Call': Unknown,
  'Digest': Unknown,
  'Gas': Amount,
  'Hash': Hash,
  'Index': Amount,
  'KeyValue': KeyValue,
  'Vec<KeyValue>': KeyValueArray,
  'MisbehaviorReport': Unknown,
  'ParachainId': Amount,
  'PropIndex': Amount,
  'Proposal': Proposal,
  'ReferendumIndex': Amount,
  'SessionKey': Amount,
  'Signature': Hash,
  'String': StringParam,
  'Timestamp': Timestamp,
  'u32': Amount,
  'u64': Amount,
  'VoteIndex': Amount,
  'VoteThreshold': VoteThreshold
};

export default function findComponent (def: TypeDef, overrides: ComponentMap = {}): React.ComponentType<Props> {
  const type = def.info === TypeDefInfo.Compact
    ? (def.sub as TypeDef).type
    : def.type;
  const component = overrides[type] || components[type];

  // FIXME We still don't support either structure or Vector inputs
  if (!component && def.info !== TypeDefInfo.Plain) {
    return Unknown;
  }

  return component || Unknown;
}
