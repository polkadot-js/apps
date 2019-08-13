// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OnChangeCb } from '../types';

import { isFunction, isObservable } from '@polkadot/util';

export default function triggerChange (value?: any, ...callOnResult: (OnChangeCb | undefined)[]): void {
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
