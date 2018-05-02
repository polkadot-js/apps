// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export const queries: rxjs$BehaviorSubject<Array<*>> = new BehaviorSubject([]);
export const subject: rxjs$BehaviorSubject<*> = new BehaviorSubject();
