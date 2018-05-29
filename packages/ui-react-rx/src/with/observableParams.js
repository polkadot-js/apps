// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { HOC, Options } from './types';

import withObservable from './observable';

export default function withObservableParams<T> (observable: rxjs$Observable<T> | rxjs$Subject<T>, options?: Options<T> = {}): HOC<T> {
  return withObservable(observable, {
    propName: 'params',
    // flowlint-next-line inexact-spread:off
    ...options
  });
}
