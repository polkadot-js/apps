// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

type HOC = (Component: React.ComponentType<any>) => React.ComponentType<any>;

export default function withMulti<T> (Component: React.ComponentType<any>, ...hocs: Array<HOC>): React.ComponentType<any> {
  return hocs.reduce((Component, hoc) => {
    return hoc(Component);
  }, Component);
}
