// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Values } from '@polkadot/params/types';
import type { Storage$Key } from '@polkadot/storage/types';
import type { StorageTransform } from '../types';

import decodeParams from '@polkadot/params/decode';

export default function storageTransform ({ type }: Storage$Key): StorageTransform {
  return (input?: Uint8Array = new Uint8Array(0), index: number): Param$Values | null => {
    try {
      return decodeParams(type, input).value;
    } catch (error) {
      console.error('Decoding', type, '::', error);
      return null;
    }
  };
}
