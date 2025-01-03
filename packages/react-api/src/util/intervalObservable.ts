// Copyright 2017-2025 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { Subscription } from 'rxjs';
import type { CallState } from '../types.js';

import { interval } from 'rxjs';

const interval$ = interval(500);

export function intervalObservable<Props, State extends CallState> (that: React.Component<Props, State>): Subscription {
  return interval$.subscribe((): void => {
    const elapsed = Date.now() - (that.state.callUpdatedAt || 0);
    const callUpdated = elapsed <= 1500;

    if (callUpdated !== that.state.callUpdated) {
      that.setState({
        callUpdated
      });
    }
  });
}
