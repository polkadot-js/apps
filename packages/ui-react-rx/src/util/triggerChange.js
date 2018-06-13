// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { OnChangeCb } from '../types';

import isFunction from '@polkadot/util/is/function';
import isObservable from '@polkadot/util/is/observable';

export default function triggerChange<T> (value?: T, ...onChange: Array<?OnChangeCb<T>>): void {
  if (!onChange || !onChange.length) {
    return;
  }

  onChange.forEach((onChange) => {
    if (isObservable(onChange)) {
      // $FlowFixMe type determined
      onChange.next(value);
    } else if (isFunction(onChange)) {
      // $FlowFixMe type determined
      onChange(value);
    }
  });
}
