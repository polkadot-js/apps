// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Codec } from '@polkadot/types/types';
import { Balance, Bytes, Compact, H256, H512, KeyValue, Struct, Tuple, TypeDef, TypeDefInfo, UInt, Vector, createType } from '@polkadot/types';
import { Props, ComponentMap } from './types';

import AccountComponent from './Param/Account';
import AmountComponent from './Param/Amount';
import BalanceComponent from './Param/Balance';
import BoolComponent from './Param/Bool';
import BytesComponent from './Param/Bytes';
import CodeComponent from './Param/Code';
import HashComponent from './Param/Hash';
import MomentComponent from './Param/Moment';
import ProposalComponent from './Param/Proposal';
import KeyValueComponent from './Param/KeyValue';
import KeyValueArrayComponent from './Param/KeyValueArray';
import TextComponent from './Param/Text';
import StructComponent from './Param/Struct';
import TupleComponent from './Param/Tuple';
import Unknown from './Param/Unknown';
import VectorComponent from './Param/Vector';
import VoteComponent from './Param/Vote';
import VoteThresholdComponent from './Param/VoteThreshold';
import { isFunction } from '@polkadot/util';

const components: ComponentMap = {
  'AccountId': AccountComponent,
  'AccountIdOf': AccountComponent,
  'AccountIndex': AmountComponent,
  'Address': AccountComponent,
  'Balance': BalanceComponent,
  'BalanceOf': BalanceComponent,
  'BlockNumber': AmountComponent,
  'bool': BoolComponent,
  'Bytes': BytesComponent,
  'Code': CodeComponent,
  'CodeHash': HashComponent,
  'Gas': AmountComponent,
  'Hash': HashComponent,
  'Index': AmountComponent,
  'KeyValue': KeyValueComponent,
  'Vec<KeyValue>': KeyValueArrayComponent,
  'ParaId': AmountComponent,
  'Moment': MomentComponent,
  'MomentOf': MomentComponent,
  'ProposalIndex': AmountComponent,
  'PropIndex': AmountComponent,
  'Proposal': ProposalComponent,
  'ReferendumIndex': AmountComponent,
  'SeedOf': HashComponent,
  'SessionKey': AccountComponent,
  'Signature': HashComponent,
  'String': TextComponent,
  'Struct': StructComponent,
  'Text': TextComponent,
  'Tuple': TupleComponent,
  'u32': AmountComponent,
  'u64': AmountComponent,
  'u128': AmountComponent,
  'Vector': VectorComponent,
  'Vote': VoteComponent,
  'VoteIndex': AmountComponent,
  'VoteThreshold': VoteThresholdComponent
};

function isCodec (value: any): value is Codec {
  return !!value && isFunction(value.toU8a);
}

function findByInstance (value: Codec, isDisabled: boolean, overrides: ComponentMap): React.ComponentType<Props> {
  if (value instanceof Struct) {
    return isDisabled
      ? StructComponent
      : Unknown;
  } else if (value instanceof Tuple) {
    return TupleComponent;
  } else if (value instanceof Vector) {
    return value[0] && value[0] instanceof KeyValue
      ? KeyValueArrayComponent
      : VectorComponent;
  } else if (value instanceof Balance) {
    return BalanceComponent;
  } else if (value instanceof Bytes) {
    return BytesComponent;
  } else if (value instanceof Compact) {
    return findByInstance(value.unwrap(), isDisabled, overrides);
  } else if (value instanceof H256 || value instanceof H512) {
    return HashComponent;
  } else if (value instanceof String) {
    return TextComponent;
  } else if (value instanceof UInt) {
    return AmountComponent;
  }

  return Unknown;
}

function findByTypeDef (value: TypeDef, isDisabled: boolean, overrides: ComponentMap): React.ComponentType<Props> {
  const type = (({ info, sub, type }: TypeDef) => {
    switch (info) {
      case TypeDefInfo.Compact:
        return (sub as TypeDef).type;

      case TypeDefInfo.Tuple:
        return 'Tuple';

      case TypeDefInfo.Struct:
        return 'Struct';

      case TypeDefInfo.Vector:
        return ['Vec<KeyValue>'].includes(type)
          ? 'Vec<KeyValue>'
          : 'Vector';

      default:
        return type;
    }
  })(value);

  let Component = overrides[type] || components[type];

  if (Component) {
    return Component;
  }

  return findByInstance(createType(value.type), isDisabled, overrides);
}

export default function findComponent (value: TypeDef | Codec, isDisabled: boolean = false, overrides: ComponentMap = {}): React.ComponentType<Props> {
  return isCodec(value)
    ? findByInstance(value, isDisabled, overrides)
    : findByTypeDef(value, isDisabled, overrides);
}
