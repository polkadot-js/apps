// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DefaultProps, Options } from './types';
import { BaseProps } from '../types';

import React from 'react';

import withCall from './call';

type Props<T> = BaseProps<T> & {
  value?: T
};

export default function withCallDiv<T> (endpoint: string, options: Options<T> = {}) {
  return (render: (value?: T) => React.ReactNode, defaultProps: DefaultProps<T> = {}): React.ComponentType<any> => {
    class Inner extends React.PureComponent<Props<T>> {
      render () {
        const { children, className = defaultProps.className, label = '', rxUpdated, style, value } = this.props;

        return (
          <div
            {...defaultProps}
            className={[className, rxUpdated ? 'rx--updated' : undefined].join(' ')}
            style={style}
          >
            {label}{render(value)}{children}
          </div>
        );
      }
    }

    return withCall(endpoint, { ...options, propName: 'value' })(Inner);
  };
}
