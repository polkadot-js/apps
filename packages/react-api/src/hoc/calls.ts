// Copyright 2017-2025 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { ApiProps, SubtractProps } from '../types.js';
import type { Options } from './types.js';

import withCall from './call.js';

type Call = string | [string, Options];

export default function withCalls <P> (...calls: Call[]): (Component: React.ComponentType<P>) => React.ComponentType<SubtractProps<P, ApiProps>> {
  return (Component: React.ComponentType<P>): React.ComponentType<any> => {
    // NOTE: Order is reversed so it makes sense in the props, i.e. component
    // after something can use the value of the preceding version
    return calls
      .reverse()
      .reduce((Component, call): React.ComponentType<any> => {
        return Array.isArray(call)
          ? withCall(...call)(Component as unknown as React.ComponentType<ApiProps>)
          : withCall(call)(Component as unknown as React.ComponentType<ApiProps>);
      }, Component);
  };
}
