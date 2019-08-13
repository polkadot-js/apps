// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps, SubtractProps } from '../types';
import { Options } from './types';

import React from 'react';
import withCall from './call';

type Call = string | [string, Options];

export default function withCalls <P> (...calls: Call[]): (Component: React.ComponentType<P>) => React.ComponentType<SubtractProps<P, ApiProps>> {
  return (Component: React.ComponentType<P>): React.ComponentType<any> => {
    // NOTE: Order is reversed so it makes sense in the props, i.e. component
    // after something can use the value of the preceding version
    return calls
      .reverse()
      .reduce((Component, call): React.ComponentType<any> => {
        return Array.isArray(call)
          ? withCall(...call)(Component as any)
          : withCall(call)(Component as any);
      }, Component);
  };
}
