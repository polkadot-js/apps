// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { Registry, TypeDef } from '@polkadot/types/types';
import type { ComponentMap, Props } from '../types.js';

import { getTypeDef } from '@polkadot/types';
import { TypeDefInfo } from '@polkadot/types/types';
import { isBn } from '@polkadot/util';

import Account from './Account.js';
import Amount from './Amount.js';
import Balance from './Balance.js';
import AccountId20 from './BasicAccountId20.js';
import AccountId32 from './BasicAccountId32.js';
import Bool from './Bool.js';
import BTreeMap from './BTreeMap.js';
import Bytes from './Bytes.js';
import Call from './Call.js';
import Cid from './Cid.js';
import Code from './Code.js';
import DispatchError from './DispatchError.js';
import DispatchResult from './DispatchResult.js';
import Enum from './Enum.js';
import Hash160 from './Hash160.js';
import Hash256 from './Hash256.js';
import Hash512 from './Hash512.js';
import KeyValue from './KeyValue.js';
import KeyValueArray from './KeyValueArray.js';
import Moment from './Moment.js';
import Null from './Null.js';
import OpaqueCall from './OpaqueCall.js';
import Option from './Option.js';
import Raw from './Raw.js';
import Struct from './Struct.js';
import Text from './Text.js';
import Tuple from './Tuple.js';
import Unknown from './Unknown.js';
import Vector from './Vector.js';
import VectorFixed from './VectorFixed.js';
import Vote from './Vote.js';
import VoteThreshold from './VoteThreshold.js';

interface TypeToComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  c: React.ComponentType<any>;
  t: string[];
}

const SPECIAL_TYPES = ['AccountId', 'AccountId20', 'AccountId32', 'AccountIndex', 'Address', 'Balance', 'BalanceOf', 'Vec<KeyValue>'];

const DISPATCH_ERROR = ['DispatchError', 'SpRuntimeDispatchError'];

const componentDef: TypeToComponent[] = [
  { c: Account, t: ['AccountId', 'Address', 'LookupSource', 'MultiAddress'] },
  { c: Amount, t: ['AccountIndex', 'i8', 'i16', 'i32', 'i64', 'i128', 'u8', 'u16', 'u32', 'u64', 'u128', 'u256'] },
  { c: Balance, t: ['Amount', 'Balance', 'BalanceOf'] },
  { c: Bool, t: ['bool'] },
  { c: Bytes, t: ['Bytes', 'Vec<u8>'] },
  { c: Call, t: ['Call', 'Proposal', 'RuntimeCall'] },
  { c: Cid, t: ['PalletAllianceCid'] },
  { c: Code, t: ['Code'] },
  { c: DispatchError, t: DISPATCH_ERROR },
  { c: DispatchResult, t: ['DispatchResult', 'Result<Null, SpRuntimeDispatchError>'] },
  { c: Raw, t: ['Raw', 'RuntimeSessionKeys', 'Keys'] },
  { c: Enum, t: ['Enum'] },
  { c: Hash256, t: ['Hash', 'H256'] },
  { c: Hash160, t: ['H160'] },
  { c: Hash512, t: ['H512'] },
  { c: KeyValue, t: ['KeyValue'] },
  { c: KeyValueArray, t: ['Vec<KeyValue>'] },
  { c: Moment, t: ['Moment', 'MomentOf'] },
  { c: Null, t: ['Null'] },
  { c: OpaqueCall, t: ['OpaqueCall'] },
  { c: Option, t: ['Option'] },
  { c: Text, t: ['String', 'Text'] },
  { c: Struct, t: ['Struct'] },
  { c: Tuple, t: ['Tuple'] },
  { c: BTreeMap, t: ['BTreeMap'] },
  { c: Vector, t: ['Vec', 'BTreeSet'] },
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

function fromDef ({ displayName, info, lookupName, sub, type }: TypeDef): string {
  if (displayName && SPECIAL_TYPES.includes(displayName)) {
    return displayName;
  } else if (type.endsWith('RuntimeSessionKeys')) {
    return 'RuntimeSessionKeys';
  }

  const typeValue = lookupName || type;

  switch (info) {
    case TypeDefInfo.Compact:
      return (sub as TypeDef).type;

    case TypeDefInfo.Option:
      return 'Option';

    case TypeDefInfo.Enum:
      return 'Enum';

    case TypeDefInfo.Result: {
      const [, errSub] = (sub as TypeDef[]);

      return DISPATCH_ERROR.includes(errSub.lookupName || errSub.type)
        ? 'DispatchResult'
        : typeValue;
    }

    case TypeDefInfo.Struct:
      return 'Struct';

    case TypeDefInfo.BTreeSet:
      return 'BTreeSet';

    case TypeDefInfo.BTreeMap:
      return 'BTreeMap';

    case TypeDefInfo.Tuple:
      return components[type] === Account
        ? type
        : 'Tuple';

    case TypeDefInfo.Vec:
      return type === 'Vec<u8>'
        ? 'Bytes'
        : ['Vec<KeyValue>'].includes(type)
          ? 'Vec<KeyValue>'
          : 'Vec';

    case TypeDefInfo.VecFixed:
      return (sub as TypeDef).type === 'u8'
        ? type
        : 'VecFixed';

    default:
      return typeValue;
  }
}

export default function findComponent (registry: Registry, def: TypeDef, overrides: ComponentMap = {}): React.ComponentType<Props> {
  // Explicit/special handling for Account20/32 types where they don't match
  // the actual chain we are connected to
  if (['AccountId20', 'AccountId32'].includes(def.type)) {
    const defType = `AccountId${registry.createType('AccountId').length}`;

    if (def.type !== defType) {
      if (def.type === 'AccountId20') {
        return AccountId20;
      } else {
        return AccountId32;
      }
    }
  }

  const findOne = (type?: string): React.ComponentType<Props> | null =>
    type
      ? overrides[type] || components[type]
      : null;

  const type = fromDef(def);
  let Component = findOne(def.lookupName) || findOne(def.type) || findOne(type);

  if (!Component) {
    try {
      const instance = registry.createType(type as 'u32');
      const raw = getTypeDef(instance.toRawType());

      Component = findOne(raw.lookupName || raw.type) || findOne(fromDef(raw));

      if (Component) {
        return Component;
      } else if (isBn(instance)) {
        return Amount;
      }
    } catch (e) {
      console.error(`params: findComponent: ${(e as Error).message}`);
    }

    // we only want to want once, not spam
    if (!warnList.includes(type)) {
      warnList.push(type);
      console.info(`params: findComponent: No pre-defined component for type ${type} from ${TypeDefInfo[def.info]}: ${JSON.stringify(def)}`);
    }
  }

  return Component || Unknown;
}
