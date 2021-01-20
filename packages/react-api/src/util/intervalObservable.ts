// Copyright 2017-2021 @canvas-ui/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Subscription } from 'rxjs';
import { interval } from 'rxjs/observable/interval';

import { CallState } from '../types';

const interval$ = interval(500);

export default function intervalObservable<Props, State extends CallState> (that: React.Component<Props, State>): Subscription {
  return interval$.subscribe((): void => {
    const elapsed = Date.now() - ((that.state.callUpdatedAt as number) || 0);
    const callUpdated = elapsed <= 1500;

    if (callUpdated !== that.state.callUpdated) {
      that.setState({
        callUpdated
      });
    }
  });
}
