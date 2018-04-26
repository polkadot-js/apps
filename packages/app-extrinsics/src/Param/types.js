// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Param } from '../extrinsics/types';

export type Props = {
  className?: string,
  label?: string,
  style?: {
    [string]: string
  },
  subject: rxjs$BehaviorSubject<*>,
  value: Extrinsic$Param
};
