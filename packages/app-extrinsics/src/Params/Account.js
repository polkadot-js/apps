// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from './types';

import React from 'react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import BaseAccount from '../Account';

export default function Account ({ isError, label, subject }: Props): React$Node {
  const account: rxjs$BehaviorSubject<Uint8Array> = new BehaviorSubject(new Uint8Array([]));

  account.subscribe((value: Uint8Array) =>
    subject.next({
      isValid: !!(value && value.length),
      value
    })
  );

  return (
    <BaseAccount
      isError={isError}
      label={label}
      subject={account}
    />
  );
}
