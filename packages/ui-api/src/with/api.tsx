// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps, SubtractProps } from '../types';
import { DefaultProps } from './types';

import React from 'react';
import { assert } from '@polkadot/util';

import { ApiConsumer } from '../ApiContext';

export default function withApi <P extends ApiProps> (Inner: React.ComponentType<P>, defaultProps: DefaultProps = {}): React.ComponentType<any> {
  return class WithApi extends React.PureComponent<SubtractProps<P, ApiProps>> {
    component: any = React.createRef();

    render () {
      return (
        <ApiConsumer>
          {(apiProps?: ApiProps) => {
            assert(apiProps && apiProps.api, `Application root must be wrapped inside 'rx-react/Api' to provide API context`);

            return (
              // @ts-ignore Something here with the props are going wonky
              <Inner
                {...defaultProps}
                {...apiProps}
                {...this.props}
                ref={this.component}
              />
            );
          }}
        </ApiConsumer>
      );
    }
  };
}
