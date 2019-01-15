// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OnChangeCb } from '../types';

import { isFunction, isObservable } from '@polkadot/util';

export default function triggerChange (value?: any, ...callOnChange: Array<OnChangeCb>): void {
  if (!callOnChange || !callOnChange.length) {
    return;
  }

  callOnChange.forEach((callOnChange) => {
    if (isObservable(callOnChange)) {
      callOnChange.next(value);
    } else if (isFunction(callOnChange)) {
      callOnChange(value);
    }
  });
}
