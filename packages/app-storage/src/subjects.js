// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { StorageQuery } from './types';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import storage from '@polkadot/storage-substrate/keys';

type ValueSubject = rxjs$BehaviorSubject<*>;
type ValueSubjects = Array<ValueSubject>;

type Subjects = {
  next: rxjs$BehaviorSubject<StorageDef$Key>,
  params: rxjs$BehaviorSubject<ValueSubjects>,
  queries: rxjs$BehaviorSubject<Array<StorageQuery>>
};

function createSubjects (): Subjects {
  return {
    next: new BehaviorSubject(storage.timestamp.keys.current),
    params: new BehaviorSubject([]),
    queries: new BehaviorSubject([])
  };
}

export default createSubjects();
