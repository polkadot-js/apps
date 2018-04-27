// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Params } from '../extrinsics/types';
import type { RawParam } from '../types';

import createSubjects from './subjects';

export default function subscriber (params: Extrinsic$Params, subject: rxjs$BehaviorSubject<Array<RawParam>>): Array<rxjs$BehaviorSubject<RawParam>> {
  const subjects = createSubjects(params);

  if (subject) {
    const onChange = (): void => {
      subject.next(subjects.map((s) => s.getValue()));
    };

    subjects.forEach((s) => s.subscribe(onChange));
  }

  return subjects;
}
