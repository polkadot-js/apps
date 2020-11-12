// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Registry, TypeDef, TypeDefInfo } from '@polkadot/types/types';

import { Raw } from '@polkadot/types';
import { getTypeDef } from '@polkadot/types/create';
import { BN_ZERO, isBn } from '@polkadot/util';

const warnList: string[] = [];

export default function getInitValue (registry: Registry, def: TypeDef): unknown {
  if (def.info === TypeDefInfo.Vec) {
    return [getInitValue(registry, def.sub as TypeDef)];
  } else if (def.info === TypeDefInfo.Tuple) {
    return Array.isArray(def.sub)
      ? def.sub.map((def) => getInitValue(registry, def))
      : [];
  } else if (def.info === TypeDefInfo.Struct) {
    return Array.isArray(def.sub)
      ? def.sub.reduce((result: Record<string, unknown>, def): Record<string, unknown> => {
        result[def.name as string] = getInitValue(registry, def);

        return result;
      }, {})
      : {};
  } else if (def.info === TypeDefInfo.Enum) {
    return Array.isArray(def.sub)
      ? { [def.sub[0].name as string]: getInitValue(registry, def.sub[0]) }
      : {};
  }

  const type = [TypeDefInfo.Compact, TypeDefInfo.Option].includes(def.info)
    ? (def.sub as TypeDef).type
    : def.type;

  switch (type) {
    case 'AccountIndex':
    case 'Balance':
    case 'BalanceOf':
    case 'BlockNumber':
    case 'Compact':
    case 'Gas':
    case 'Index':
    case 'Nonce':
    case 'ParaId':
    case 'PropIndex':
    case 'ProposalIndex':
    case 'ReferendumIndex':
    case 'i8':
    case 'i16':
    case 'i32':
    case 'i64':
    case 'i128':
    case 'u8':
    case 'u16':
    case 'u32':
    case 'u64':
    case 'u128':
    case 'VoteIndex':
      return BN_ZERO;

    case 'bool':
      return false;

    case 'Bytes':
      return undefined;

    case 'String':
    case 'Text':
      return '';

    case 'Moment':
      return BN_ZERO;

    case 'Vote':
      return -1;

    case 'VoteThreshold':
      return 0;

    case 'BlockHash':
    case 'CodeHash':
    case 'Hash':
    case 'H256':
      return registry.createType('H256');

    case 'H512':
      return registry.createType('H512');

    case 'H160':
      return registry.createType('H160');

    case 'Raw':
    case 'Keys':
      return '';

    case 'AccountId':
    case 'AccountIdOf':
    case 'Address':
    case 'Call':
    case 'CandidateReceipt':
    case 'Digest':
    case 'Header':
    case 'KeyValue':
    case 'LookupSource':
    case 'MisbehaviorReport':
    case 'Proposal':
    case 'Signature':
    case 'SessionKey':
    case 'StorageKey':
    case 'ValidatorId':
      return undefined;

    case 'Extrinsic':
      return new Raw(registry);

    case 'Null':
      return null;

    default: {
      let error: string | null = null;

      try {
        const instance = registry.createType(type as 'u32');
        const raw = getTypeDef(instance.toRawType());

        if (isBn(instance)) {
          return BN_ZERO;
        } else if ([TypeDefInfo.Struct].includes(raw.info)) {
          return undefined;
        } else if ([TypeDefInfo.Enum, TypeDefInfo.Tuple].includes(raw.info)) {
          return getInitValue(registry, raw);
        }
      } catch (e) {
        error = (e as Error).message;
      }

      // we only want to want once, not spam
      if (!warnList.includes(type)) {
        warnList.push(type);
        error && console.error(`params: initValue: ${error}`);
        console.info(`params: initValue: No default value for type ${type} from ${JSON.stringify(def)}, using defaults`);
      }

      return '0x';
    }
  }
}
