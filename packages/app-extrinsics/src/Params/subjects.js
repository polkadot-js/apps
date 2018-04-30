// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Params } from '@polkadot/extrinsics/types';
import type { RawParam } from '../types';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import isUndefined from '@polkadot/util/is/undefined';

import getInitValue from './initValue';

export default function subjects (params: Extrinsic$Params, subject: rxjs$BehaviorSubject<Array<RawParam>>): Array<rxjs$BehaviorSubject<RawParam>> {
  const subjects = params.map((param): rxjs$BehaviorSubject<RawParam> => {
    const value = getInitValue(param);

    return new BehaviorSubject({
      isValid: !isUndefined(value),
      value
    });
  });

  if (subject) {
    const onChange = (): void => {
      subject.next(
        subjects.map((s) => s.getValue())
      );
    };

    subjects.forEach((s) => s.subscribe(onChange));
  }

  return subjects;
}
