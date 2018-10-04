// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { StorageTransform } from '../types';

export default function storageTransform ({ type }: SectionItem<Storages>): StorageTransform {
  return (input: Uint8Array = new Uint8Array(0), index: number): Param$Values | null => {
    try {
      return decodeParams(type, input, 'latest', true).value;
    } catch (error) {
      console.error('Decoding', type, '::', error);
      return null;
    }
  };
}
