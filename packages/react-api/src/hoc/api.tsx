// Copyright 2017-2023 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps, SubtractProps } from '../types';
import type { DefaultProps } from './types';

import React from 'react';

import { assert } from '@polkadot/util';

import { ApiContext } from '../Api';

export default function withApi <P extends ApiProps> (Inner: React.ComponentType<P>, defaultProps: DefaultProps = {}): React.ComponentType<any> {
  class WithApi extends React.PureComponent<SubtractProps<P, ApiProps>> {
    private component: any = React.createRef();

    public override render (): React.ReactNode {
      return (
        <ApiContext.Consumer>
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
        </ApiContext.Consumer>
      );
    }
  }

  return WithApi;
}
