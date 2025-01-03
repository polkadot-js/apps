// Copyright 2017-2025 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';

type HOC = (Component: React.ComponentType<any>) => React.ComponentType<any>;

export default function withMulti<T> (Component: React.ComponentType<T>, ...hocs: HOC[]): React.ComponentType<any> {
  // NOTE: Order is reversed so it makes sense in the props, i.e. component
  // after something can use the value of the preceding version
  return hocs
    .reverse()
    .reduce((Component, hoc): React.ComponentType<any> =>
      hoc(Component), Component
    );
}
