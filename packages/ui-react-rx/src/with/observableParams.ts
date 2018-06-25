// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { HOC, Options } from './types';

import withObservable from './observable';

// FIXME Observable/Subject types

export default function withObservableParams<T> (observable: any, options: Options<T> = {}): HOC<T> {
  return withObservable(observable, {
    propName: 'params',
    ...options
  });
}
