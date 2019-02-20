// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RawParam$Value } from './types';

import BN from 'bn.js';
import { Bytes, Hash, TypeDef, TypeDefInfo } from '@polkadot/types';

export default function getInitValue (def: TypeDef): RawParam$Value | Array<RawParam$Value> {
  if (def.info === TypeDefInfo.Vector) {
    return [getInitValue(def.sub as TypeDef)];
  } else if (def.info === TypeDefInfo.Tuple) {
    return Array.isArray(def.sub)
      ? def.sub.map((def) => getInitValue(def))
      : [];
  } else if (def.info === TypeDefInfo.Struct) {
    console.error(`Unable to determine default type from Struct ${JSON.stringify(def)}`);
    return void 0;
  }

  const type = def.info === TypeDefInfo.Compact
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
    case 'ParaId':
    case 'PropIndex':
    case 'ProposalIndex':
    case 'ReferendumIndex':
    case 'SessionKey':
    case 'u32':
    case 'u64':
    case 'u128':
    case 'VoteIndex':
      return new BN(0);

    case 'bool':
      return false;

    case 'String':
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
      return new Hash();

    case 'AccountId':
    case 'AccountIdOf':
    case 'Address':
    case 'Bytes':
    case 'Call':
    case 'CandidateReceipt':
    case 'Digest':
    case 'Header':
    case 'KeyValue':
    case 'MisbehaviorReport':
    case 'Proposal':
    case 'Signature':
      return void 0;

    default:
      console.error(`Unable to determine default type for ${JSON.stringify(def)}`);
      return void 0;
  }
}
