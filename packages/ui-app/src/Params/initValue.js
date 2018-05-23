// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Types } from '@polkadot/params/types';
import type { RawParam$Values } from './types';

import BN from 'bn.js';

import typeToString from '@polkadot/params/typeToString';

export default function getInitValue (type: Param$Types): RawParam$Values {
  switch (type) {
    case 'Balance':
      return new BN(1);

    case 'BlockNumber':
    case 'Index':
    case 'SessionKey':
    case 'u64':
    case 'PropIndex':
    case 'ReferendumIndex':
    case 'u32':
    case 'VoteIndex':
      return new BN(0);

    case 'bool':
      return false;

    case 'String':
      return '';

    case 'Timestamp':
      return new Date(0);

    case 'VoteThreshold':
      return 0;

    case 'AccountId':
    case 'Bytes':
    case 'Call':
    case 'Code':
    case 'Digest':
    case 'Hash':
    case 'Header':
    case 'KeyValue':
    case 'KeyValueStorage':
    case 'MisbehaviorReport':
    case 'Proposal':
    case 'Signature':
      return void 0;

    default:
      if (Array.isArray(type)) {
        return type.map((subtype) =>
          getInitValue(subtype)
        );
      }

      // NOTE for @flow, if it fails here, we know what is missing
      (type: empty); // eslint-disable-line no-unused-expressions
      throw new Error(`Unable to determine default type for ${typeToString(type)}`);
  }
}
