// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BlockHeaders } from './types';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export const blockHeaders: rxjs$BehaviorSubject<BlockHeaders> = new BehaviorSubject([]);
