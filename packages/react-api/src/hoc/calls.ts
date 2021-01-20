// Copyright 2017-2021 @canvas-ui/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { ApiProps, SubtractProps } from '../types';
import withCall from './call';
import { Options } from './types';

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
