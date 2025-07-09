// Copyright 2017-2025 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps, SubtractProps } from '../types.js';
import type { DefaultProps } from './types.js';

import React from 'react';

import { ApiCtx } from '@polkadot/react-hooks/ctx/Api';
import { assert } from '@polkadot/util';

export default function withApi <P extends ApiProps> (Inner: React.ComponentType<P>, defaultProps: DefaultProps = {}): React.ComponentType<any> {
  class WithApi extends React.PureComponent<SubtractProps<P, ApiProps>> {
    private component: any = React.createRef();

    public override render (): React.ReactNode {
      return (
        <ApiCtx.Consumer>
          {(apiProps?: ApiProps): React.ReactNode => {
            assert(apiProps?.api, 'Application root must be wrapped inside \'react-api/Api\' to provide API context');

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
        </ApiCtx.Consumer>
      );
    }
  }

  return WithApi;
}
