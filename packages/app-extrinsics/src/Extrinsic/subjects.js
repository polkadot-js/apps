// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { EncodedParams } from '../types';
import type { Subjects } from './types';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import encodeExtrinsic from '@polkadot/extrinsics-codec/encode/extrinsic';
import isUndefined from '@polkadot/util/is/undefined';

export default function subjects (subject: rxjs$BehaviorSubject<EncodedParams>): Subjects {
  const subjects = ({
    method: new BehaviorSubject(({}: $Shape<Extrinsic>)),
    params: new BehaviorSubject([])
  }: $Shape<Subjects>);

  const onChange = (): void => {
    const extrinsic = subjects.method.getValue();
    const values = subjects.params.getValue();
    const isValid = !!extrinsic.params && Object.values(extrinsic.params).reduce((isValid, param, index) => {
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

  subjects.subscribe = (): void => {
    subjects.params.subscribe(onChange);
  };

  return subjects;
}
