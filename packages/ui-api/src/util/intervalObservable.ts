// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallState } from '../types';

import { interval } from 'rxjs/observable/interval';

const interval$ = interval(500);

export default function intervalSubscribe<T, Props, State extends CallState> (that: React.Component<Props, State>) {
  return interval$.subscribe(() => {
    const elapsed = Date.now() - ((that.state.callUpdatedAt as number) || 0);
    const callUpdated = elapsed <= 1500;

    if (callUpdated !== that.state.callUpdated) {
      that.setState({
        callUpdated
      });
    }
  });
}
