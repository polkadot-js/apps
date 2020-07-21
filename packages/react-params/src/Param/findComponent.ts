// Copyright 2017-2020 @polkadot/react-params authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef, TypeDefInfo } from '@polkadot/types/types';
import { Props, ComponentMap } from '../types';

import { registry } from '@polkadot/react-api';
import { getTypeDef, SPECIAL_TYPES } from '@polkadot/types';
import { isBn } from '@polkadot/util';

import Account from './Account';
import Amount from './Amount';
import Balance from './Balance';
import Bool from './Bool';
import Bytes from './Bytes';
import Call from './Call';
import Code from './Code';
import DispatchError from './DispatchError';
import Enum from './Enum';
import Hash256 from './Hash256';
import Hash512 from './Hash512';
import KeyValue from './KeyValue';
import KeyValueArray from './KeyValueArray';
import Moment from './Moment';
import Null from './Null';
import OpaqueCall from './OpaqueCall';
import Option from './Option';
import Raw from './Raw';
import Struct from './Struct';
import Text from './Text';
import Tuple from './Tuple';
import Unknown from './Unknown';
import Vector from './Vector';
import VectorFixed from './VectorFixed';
import Vote from './Vote';
import VoteThreshold from './VoteThreshold';

interface TypeToComponent {
  c: React.ComponentType<any>;
  t: string[];
}

const componentDef: TypeToComponent[] = [
  { c: Account, t: ['AccountId', 'AccountIdOf', 'Address', 'AuthorityId', 'LookupSource', 'LookupTarget', 'SessionKey', 'ValidatorId'] },
  { c: Amount, t: ['AccountIndex', 'AssetId', 'BlockNumber', 'Gas', 'Index', 'Nonce', 'ParaId', 'ProposalIndex', 'PropIndex', 'ReferendumIndex', 'i8', 'i16', 'i32', 'i64', 'i128', 'u8', 'u16', 'u32', 'u64', 'u128', 'u256', 'VoteIndex'] },
  { c: Balance, t: ['Amount', 'AssetOf', 'Balance', 'BalanceOf'] },
  { c: Bool, t: ['bool'] },
  { c: Bytes, t: ['Bytes'] },
  { c: Call, t: ['Call', 'Proposal'] },
  { c: Code, t: ['Code'] },
  { c: DispatchError, t: ['DispatchError'] },
  { c: Raw, t: ['Raw', 'Keys'] },
  { c: Enum, t: ['Enum'] },
  { c: Hash256, t: ['BlockHash', 'CodeHash', 'Hash', 'H256', 'SeedOf'] },
  { c: Hash512, t: ['H512', 'Signature'] },
  { c: KeyValue, t: ['KeyValue'] },
  { c: KeyValueArray, t: ['Vec<KeyValue>'] },
  { c: Moment, t: ['Moment', 'MomentOf'] },
  { c: Null, t: ['Null'] },
  { c: OpaqueCall, t: ['OpaqueCall'] },
  { c: Option, t: ['Option'] },
  { c: Text, t: ['String', 'Text'] },
  { c: Struct, t: ['Struct'] },
  { c: Tuple, t: ['Tuple'] },
  { c: Vector, t: ['Vec'] },
  { c: VectorFixed, t: ['VecFixed'] },
  { c: Vote, t: ['Vote'] },
  { c: VoteThreshold, t: ['VoteThreshold'] },
  { c: Unknown, t: ['Unknown'] }
];

const components: ComponentMap = componentDef.reduce((components, { c, t }): ComponentMap => {
  t.forEach((type): void => {
    components[type] = c;
  });

  return components;
}, {} as unknown as ComponentMap);

const warnList: string[] = [];

function fromDef ({ displayName, info, sub, type }: TypeDef): string {
  if (displayName && SPECIAL_TYPES.includes(displayName)) {
    return displayName;
  }

  switch (info) {
    case TypeDefInfo.Compact:
      return (sub as TypeDef).type;

    case TypeDefInfo.Option:
      return 'Option';

    case TypeDefInfo.Enum:
      return 'Enum';

    case TypeDefInfo.Struct:
      return 'Struct';

    case TypeDefInfo.Tuple:
      if (components[type] === Account) {
        return type;
      }

      return 'Tuple';

    case TypeDefInfo.Vec:
      if (type === 'Vec<u8>') {
        return 'Bytes';
      }

      return ['Vec<KeyValue>'].includes(type)
        ? 'Vec<KeyValue>'
        : 'Vec';

    case TypeDefInfo.VecFixed:
      if ((sub as TypeDef).type === 'u8') {
        return type;
      }

      return 'VecFixed';

    default:
      return type;
  }
}

export default function findComponent (def: TypeDef, overrides: ComponentMap = {}): React.ComponentType<Props> {
  const findOne = (type: string): React.ComponentType<Props> | null =>
    overrides[type] || components[type];
  const type = fromDef(def);
  let Component = findOne(type);

  if (!Component) {
    let error: string | null = null;

    try {
      const instance = registry.createType(type as 'u32');
      const raw = getTypeDef(instance.toRawType());

      Component = findOne(raw.type);

      if (Component) {
        return Component;
      } else if (isBn(instance)) {
        return Amount;
      } else if ([TypeDefInfo.Enum, TypeDefInfo.Struct, TypeDefInfo.Tuple].includes(raw.info)) {
        return findComponent(raw, overrides);
      } else if (raw.info === TypeDefInfo.VecFixed && (raw.sub as TypeDef).type !== 'u8') {
        return findComponent(raw, overrides);
      }
    } catch (e) {
      error = (e as Error).message;
    }

    // we only want to want once, not spam
    if (!warnList.includes(type)) {
      warnList.push(type);
      error && console.error(`params: findComponent: ${error}`);
      console.info(`params: findComponent: No pre-defined component for type ${type} from ${JSON.stringify(def)}, using defaults`);
    }
  }

  return Component || Unknown;
}
