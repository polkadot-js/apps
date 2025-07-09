// Copyright 2017-2025 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnChangeCb } from '../types.js';

import { isFunction, isObservable } from '@polkadot/util';

export function triggerChange (value?: unknown, ...callOnResult: (OnChangeCb | undefined)[]): void {
  if (!callOnResult?.length) {
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
