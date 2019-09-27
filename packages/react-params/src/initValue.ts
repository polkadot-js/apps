// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef, TypeDefInfo } from '@polkadot/types/types';
import { RawParamValue } from './types';

import BN from 'bn.js';
import { Bytes, U8a, createType, getTypeDef } from '@polkadot/types';

export default function getInitValue (def: TypeDef): RawParamValue | RawParamValue[] {
  if (def.info === TypeDefInfo.Vec) {
    return [getInitValue(def.sub as TypeDef)];
  } else if (def.info === TypeDefInfo.Tuple) {
    return Array.isArray(def.sub)
      ? def.sub.map((def): any => getInitValue(def))
      : [];
  } else if (def.info === TypeDefInfo.Struct) {
    return Array.isArray(def.sub)
      ? def.sub.reduce((result, def): Record<string, RawParamValue | RawParamValue[]> => {
        result[def.name as string] = getInitValue(def);

        return result;
      }, {} as unknown as Record<string, RawParamValue | RawParamValue[]>)
      : {};
  } else if (def.info === TypeDefInfo.Enum) {
    return Array.isArray(def.sub)
      ? { [def.sub[0].name as string]: getInitValue(def.sub[0]) }
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
      return new BN(0);

    case 'bool':
      return false;

    case 'String':
    case 'Text':
      return '';

    case 'Moment':
      return new BN(0);

    case 'Vote':
      return -1;

    case 'VoteThreshold':
      return 0;

    case 'Bytes':
      return new Bytes();

    case 'CodeHash':
    case 'Hash':
      return createType('Hash');

    case 'H256':
      return createType('H256');

    case 'H512':
      return createType('H512');

    case 'Data':
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
    case 'MisbehaviorReport':
    case 'Proposal':
    case 'Signature':
    case 'SessionKey':
    case 'StorageKey':
    case 'ValidatorId':
      return undefined;

    case 'Extrinsic':
      return new U8a();

    case 'Null':
      return null;

    default: {
      try {
        const instance = createType(type as any);
        const raw = getTypeDef(instance.toRawType());

        if (instance instanceof BN) {
          return new BN(0);
        } else if ([TypeDefInfo.Enum, TypeDefInfo.Struct].includes(raw.info)) {
          return getInitValue(raw);
        }
      } catch (error) {
        // console.error(error.message);
      }

      console.warn(`Unable to determine default type for ${JSON.stringify(def)}`);

      return '0x';
    }
  }
}
