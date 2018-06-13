// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxProps } from '../types';

import { interval } from 'rxjs/observable/interval';

const interval$ = interval(500);

export default function intervalSubscribe<T, Props, State: RxProps<T>> (that: React$Component<Props, State>): rxjs$ISubscription {
  return interval$.subscribe(() => {
    const rxUpdated = (Date.now() - (that.state.rxUpdatedAt || 0)) <= 1500;

    if (rxUpdated !== that.state.rxUpdated) {
      that.setState({
        rxUpdated
      });
    }
  });
}
