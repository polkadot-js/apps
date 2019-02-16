// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef, TypeDefInfo } from '@polkadot/types';
import { Props, ComponentMap } from '../types';

import Account from './Account';
import Amount from './Amount';
import Balance from './Balance';
import Bool from './Bool';
import Bytes from './Bytes';
import Code from './Code';
import Hash from './Hash';
import Moment from './Moment';
import Proposal from './Proposal';
import KeyValue from './KeyValue';
import KeyValueArray from './KeyValueArray';
import Text from './Text';
import Tuple from './Tuple';
import Unknown from './Unknown';
import Vector from './Vector';
import Vote from './Vote';
import VoteThreshold from './VoteThreshold';

const components: ComponentMap = {
  'AccountId': Account,
  'AccountIdOf': Account,
  'AccountIndex': Amount,
  'Address': Account,
  'Balance': Balance,
  'BalanceOf': Balance,
  'BlockNumber': Amount,
  'bool': Bool,
  'Bytes': Bytes,
  'Code': Code,
  'CodeHash': Hash,
  'Gas': Amount,
  'Hash': Hash,
  'Index': Amount,
  'KeyValue': KeyValue,
  'Vec<KeyValue>': KeyValueArray,
  'ParaId': Amount,
  'Moment': Moment,
  'MomentOf': Moment,
  'ProposalIndex': Amount,
  'PropIndex': Amount,
  'Proposal': Proposal,
  'ReferendumIndex': Amount,
  'SeedOf': Hash,
  'SessionKey': Account,
  'Signature': Hash,
  'String': Text,
  'Text': Text,
  'Tuple': Tuple,
  'u32': Amount,
  'u64': Amount,
  'u128': Amount,
  'Vector': Vector,
  'Vote': Vote,
  'VoteIndex': Amount,
  'VoteThreshold': VoteThreshold
};

export default function findComponent (def: TypeDef, overrides: ComponentMap = {}): React.ComponentType<Props> {
  const type = (({ info, sub, type }: TypeDef) => {
    switch (info) {
      case TypeDefInfo.Compact:
        return (sub as TypeDef).type;

      case TypeDefInfo.Tuple:
        return 'Tuple';

      case TypeDefInfo.Vector:
        return ['Vec<KeyValue>'].includes(type)
          ? 'Vec<KeyValue>'
          : 'Vector';

      default:
        return type;
    }
  })(def);

  return overrides[type] || components[type] || Unknown;
}
