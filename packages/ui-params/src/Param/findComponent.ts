// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef, TypeDefInfo } from '@polkadot/types/types';
import { Props, ComponentMap } from '../types';

import BN from 'bn.js';
import { createType, getTypeDef } from '@polkadot/types';

import Account from './Account';
import Amount from './Amount';
import Balance from './Balance';
import Bool from './Bool';
import Bytes from './Bytes';
import Code from './Code';
import Enum from './Enum';
import Hash from './Hash';
import Moment from './Moment';
import Proposal from './Proposal';
import KeyValue from './KeyValue';
import KeyValueArray from './KeyValueArray';
import Null from './Null';
import Struct from './Struct';
import Text from './Text';
import Tuple from './Tuple';
import Unknown from './Unknown';
import Vector from './Vector';
import Vote from './Vote';
import VoteThreshold from './VoteThreshold';

interface TypeToComponent {
  c: React.ComponentType<Props>;
  t: string[];
}

const components: ComponentMap = ([
  { c: Account, t: ['AccountId', 'AccountIdOf', 'Address', 'AuthorityId', 'SessionKey'] },
  { c: Amount, t: ['AccountIndex', 'BlockNumber', 'Gas', 'Index', 'Nonce', 'ParaId', 'ProposalIndex', 'PropIndex', 'ReferendumIndex', 'u16', 'u32', 'u64', 'u128', 'u256', 'VoteIndex'] },
  { c: Balance, t: ['Amount', 'AssetOf', 'Balance', 'BalanceOf'] },
  { c: Bool, t: ['bool'] },
  { c: Bytes, t: ['Bytes'] },
  { c: Code, t: ['Code'] },
  { c: Enum, t: ['Enum'] },
  { c: Hash, t: ['CodeHash', 'Hash', 'SeedOf', 'Signature'] },
  { c: KeyValue, t: ['KeyValue'] },
  { c: KeyValueArray, t: ['Vec<KeyValue>'] },
  { c: Moment, t: ['Moment', 'MomentOf'] },
  { c: Null, t: ['Null'] },
  { c: Proposal, t: ['Proposal'] },
  { c: Text, t: ['String', 'Text'] },
  { c: Struct, t: ['Struct'] },
  { c: Tuple, t: ['Tuple'] },
  { c: Vector, t: ['Vector'] },
  { c: Vote, t: ['Vote'] },
  { c: VoteThreshold, t: ['VoteThreshold'] },
  { c: Unknown, t: ['Unknown'] }
] as TypeToComponent[]).reduce((components, { c, t }): ComponentMap => {
  t.forEach((type): void => {
    components[type] = c;
  });

  return components;
}, {} as unknown as ComponentMap);

export default function findComponent (def: TypeDef, overrides: ComponentMap = {}): React.ComponentType<Props> {
  const type = (({ info, sub, type }: TypeDef): string => {
    switch (info) {
      case TypeDefInfo.Compact:
      case TypeDefInfo.Option:
        return (sub as TypeDef).type;

      case TypeDefInfo.Enum:
        return 'Enum';

      case TypeDefInfo.Struct:
        return 'Struct';

      case TypeDefInfo.Tuple:
        return 'Tuple';

      case TypeDefInfo.Vec:
        return ['Vec<KeyValue>'].includes(type)
          ? 'Vec<KeyValue>'
          : 'Vector';

      default:
        return type;
    }
  })(def);

  const Component = overrides[type] || components[type];

  if (!Component) {
    try {
      const instance = createType(type as any);
      const raw = getTypeDef(instance.toRawType());

      if (instance instanceof BN) {
        return Amount;
      } else if ([TypeDefInfo.Enum, TypeDefInfo.Struct].includes(raw.info)) {
        return findComponent(raw, overrides);
      }
    } catch (error) {
      // console.error(error.message);
    }
  }

  return Component || Unknown;
}
