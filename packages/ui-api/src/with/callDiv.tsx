// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DefaultProps, Options } from './types';
import { BareProps, CallProps } from '../types';

import React from 'react';

import withCall from './call';

type Props = BareProps & CallProps & {
  children?: React.ReactNode,
  label?: string,
  value?: any
};

export default function withCallDiv<T> (endpoint: string, options: Options = {}) {
  return (render: (value?: T) => React.ReactNode, defaultProps: DefaultProps = {}): React.ComponentType<Props> => {
    class Inner extends React.PureComponent<Props> {
      render () {
        const { children, className = defaultProps.className, label = '', callUpdated, style, value } = this.props;

        return (
          <div
            {...defaultProps}
            className={[className, callUpdated ? 'rx--updated' : undefined].join(' ')}
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
