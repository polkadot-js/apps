// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { OnChangeCb, OnChangeCb$Obs } from '../types';

import isFunction from '@polkadot/util/is/function';
import isObservable from '@polkadot/util/is/observable';

export default function triggerChange<T> (value?: T, ...rxChange: Array<OnChangeCb<T>>): void {
  if (!rxChange || !rxChange.length) {
    return;
  }

  rxChange.forEach((rxChange) => {
    if (isObservable(rxChange)) {
      (rxChange as OnChangeCb$Obs<T>).next(value);
    } else if (isFunction(rxChange)) {
      rxChange(value);
    }
  });
}
