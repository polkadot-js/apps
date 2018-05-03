// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageQuery } from './types';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

type ValueSubject = rxjs$BehaviorSubject<*>;
type ValueSubjects = Array<ValueSubject>;

export const queries: rxjs$BehaviorSubject<Array<StorageQuery>> = new BehaviorSubject([]);
export const subject: rxjs$BehaviorSubject<StorageDef$Key> = new BehaviorSubject();
export const values: rxjs$BehaviorSubject<ValueSubjects> = new BehaviorSubject([]);

subject.subscribe(({ params = {} } = {}) => {
  values.next(
    Object.keys(params).map(() => new BehaviorSubject())
  );
});
