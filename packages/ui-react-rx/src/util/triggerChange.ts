// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { OnChangeCb, OnChangeCb$Obs, OnChangeCb$Fn } from '../types';

import isFunction from '@polkadot/util/is/function';
import isObservable from '@polkadot/util/is/observable';

export default function triggerChange<T> (value?: T, ...onChange: Array<OnChangeCb<T>>): void {
  if (!onChange || !onChange.length) {
    return;
  }

  onChange.forEach((onChange) => {
    if (isObservable(onChange)) {
      (onChange as OnChangeCb$Obs<T>).next(value);
    } else if (isFunction(onChange)) {
      (onChange as OnChangeCb$Fn<T>)(value);
    }
  });
}
