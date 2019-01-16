// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallProps } from '../types';

const TIMEOUT = 500;

export default function intervalTimer<T, Props, State extends CallProps> (that: React.Component<Props, State>): number {
  return window.setInterval(() => {
    const elapsed = Date.now() - ((that.state.callUpdatedAt as number) || 0);
    const callUpdated = elapsed <= 1500;

    if (callUpdated !== that.state.callUpdated) {
      that.setState({ callUpdated });
    }
  }, TIMEOUT);
}
