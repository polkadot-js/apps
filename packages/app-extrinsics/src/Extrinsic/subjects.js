// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { EncodedParams, RawParam } from '../types';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import encodeExtrinsic from '@polkadot/extrinsics-codec/src/encode/extrinsic';
import isUndefined from '@polkadot/util/is/undefined';

type Subjects = {
  method: rxjs$BehaviorSubject<Extrinsic>,
  params: rxjs$BehaviorSubject<Array<RawParam>>
};

export default function subjects (subject: rxjs$BehaviorSubject<EncodedParams>): Subjects {
  const subjects = {
    method: new BehaviorSubject(({}: $Shape<Extrinsic>)),
    params: new BehaviorSubject([])
  };

  const onChange = (): void => {
    const extrinsic = subjects.method.getValue();
    const values = subjects.params.getValue();
    const isValid = !!extrinsic.params && extrinsic.params.reduce((isValid, param, index) => {
      return isValid && !isUndefined(values[index]) && !isUndefined(values[index].value) && values[index].isValid;
    }, !!values);
    const raw = values.map((param) => param && param.value);
    const data = extrinsic.params && encodeExtrinsic(extrinsic, raw);

    subject.next({
      data,
      extrinsic,
      isValid
    });
  };

  subjects.params.subscribe(onChange);

  return subjects;
}
