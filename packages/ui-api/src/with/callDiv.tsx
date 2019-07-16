// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
    class Inner extends React.PureComponent<Props<T>> {
      public render (): React.ReactNode {
        const { callResult, callUpdated, children, className = defaultProps.className, label = '', style } = this.props;

        return (
          <div
            {...defaultProps}
            className={[className, callUpdated ? 'rx--updated' : undefined].join(' ')}
            style={style}
          >
            {label}{render(callResult)}{children}
          </div>
        );
      }
    }

    return withCall(endpoint, { ...options, propName: 'callResult' })(Inner);
  };
}
