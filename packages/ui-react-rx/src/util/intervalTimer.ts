// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RxProps } from '../types';

const TIMEOUT = 500;

export default function intervalTimer<T, Props, State extends RxProps<T>> (that: React.Component<Props, State>): number {
  return window.setInterval(() => {
    const elapsed = Date.now() - ((that.state.rxUpdatedAt as number) || 0);
    const rxUpdated = elapsed <= 1500;

    if (rxUpdated !== that.state.rxUpdated) {
      that.setState({ rxUpdated });
    }
  }, TIMEOUT);
}
