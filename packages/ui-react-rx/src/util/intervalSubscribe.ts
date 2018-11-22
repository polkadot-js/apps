// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RxProps } from '../types';

import { interval } from 'rxjs/observable/interval';

const interval$ = interval(500);

export default function intervalSubscribe<T, Props, State extends RxProps<T>> (that: React.Component<Props, State>) {
  return interval$.subscribe(() => {
    const elapsed = Date.now() - ((that.state.rxUpdatedAt as number) || 0);
    const rxUpdated = elapsed <= 1500;

    if (rxUpdated !== that.state.rxUpdated) {
      that.setState({
        rxUpdated
      });
    }
  });
}
