// Copyright 2017-2020 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefaultProps, Options } from './types';
import { BaseProps } from '../types';

import React from 'react';

import withCall from './call';

interface Props<T> extends BaseProps<T> {
  callResult?: T;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function withCallDiv<T> (endpoint: string, options: Options = {}) {
  return (render: (value?: T) => React.ReactNode, defaultProps: DefaultProps = {}): React.ComponentType<any> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    function Inner ({ callResult, callUpdated, children, className = defaultProps.className, label = '' }: any): React.ReactElement<Props<T>> {
      return (
        <div
          {...defaultProps}
          className={[className || '', callUpdated ? 'rx--updated' : undefined].join(' ')}
        >
          {label}{render(callResult)}{children}
        </div>
      );
    }

    return withCall(endpoint, { ...options, propName: 'callResult' })(Inner);
  };
}
