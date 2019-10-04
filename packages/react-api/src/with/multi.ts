// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

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
