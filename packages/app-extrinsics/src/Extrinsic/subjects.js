// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { EncodedParams } from '../types';
import type { Subjects } from './types';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export default function subjects (subject: rxjs$BehaviorSubject<EncodedParams>): Subjects {
  const extrinsic = subject.getValue().extrinsic || ({}: $Shape<Extrinsic>);

  return {
    method: new BehaviorSubject(extrinsic),
    params: new BehaviorSubject([])
  };
}
