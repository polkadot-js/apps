// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { EncodedParams } from '../types';
import type { Props } from './types';

import React from 'react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import Extrinsic from '../Extrinsic';

export default function Proposal ({ isError, label, subject }: Props): React$Node {
  const extrinsic: rxjs$BehaviorSubject<EncodedParams> = new BehaviorSubject(({ isValid: false }: $Shape<EncodedParams>));

  extrinsic.subscribe(({ data, isValid }: EncodedParams) =>
    subject.next({
      isValid,
      value: data
    })
  );

  return (
    <Extrinsic
      isError={isError}
      isPrivate
      label={label}
      subject={extrinsic}
    />
  );
}
