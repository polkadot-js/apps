// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '../types';
import { Options } from './types';

import React from 'react';
import withCall from './call';

type Call = string | [string, Options];

export default function withCalls (...calls: Array<Call>): (Component: React.ComponentType<ApiProps>) => React.ComponentType<any> {
  return (Component: React.ComponentType<ApiProps>): React.ComponentType<any> => {
    // NOTE: Order is reversed so it makes sense in the props, i.e. component
    // after something can use the value of the preceding version
    return calls
      .reverse()
      .reduce((Component, call) => {
        return Array.isArray(call)
          ? withCall(...call)(Component)
          : withCall(call)(Component);
      }, Component);
  };
}
