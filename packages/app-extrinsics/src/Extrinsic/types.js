// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { RawParam } from '@polkadot/ui-react-app/Params/types';

export type Subjects = {
  method: rxjs$BehaviorSubject<Extrinsic>,
  params: rxjs$BehaviorSubject<Array<RawParam>>
};
