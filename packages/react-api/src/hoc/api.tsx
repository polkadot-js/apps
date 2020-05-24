// Copyright 2017-2020 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps, SubtractProps } from '../types';
import { DefaultProps } from './types';

import React from 'react';
import { assert } from '@polkadot/util';

import { ApiConsumer } from '../ApiContext';

export default function withApi <P extends ApiProps> (Inner: React.ComponentType<P>, defaultProps: DefaultProps = {}): React.ComponentType<any> {
  return class WithApi extends React.PureComponent<SubtractProps<P, ApiProps>> {
    private component: any = React.createRef();

    public render (): React.ReactNode {
      return (
        <ApiConsumer>
          {(apiProps?: ApiProps): React.ReactNode => {
            assert(apiProps && apiProps.api, 'Application root must be wrapped inside \'react-api/Api\' to provide API context');

            return (
              <Inner
                {...defaultProps}
                {...(apiProps as any)}
                {...this.props}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ref={this.component}
              />
            );
          }}
        </ApiConsumer>
      );
    }
  };
}
