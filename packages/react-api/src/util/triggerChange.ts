// Copyright 2017-2021 @canvas-ui/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isFunction, isObservable } from '@polkadot/util';

import { OnChangeCb } from '../types';

export default function triggerChange (value?: unknown, ...callOnResult: (OnChangeCb | undefined)[]): void {
  if (!callOnResult || !callOnResult.length) {
    return;
  }

  callOnResult.forEach((callOnResult): void => {
    if (isObservable(callOnResult)) {
      callOnResult.next(value);
    } else if (isFunction(callOnResult)) {
      callOnResult(value);
    }
  });
}
