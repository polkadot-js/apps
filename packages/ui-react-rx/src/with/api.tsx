// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '../types';
import { DefaultProps } from './types';

import React from 'react';
import assert from '@polkadot/util/assert';

import { ApiConsumer } from '../Api/Context';

export default function withApi <T, P extends ApiProps> (Inner: React.ComponentType<P>, defaultProps: DefaultProps<T> = {}): React.ComponentType<any> {
  return class WithApi extends React.PureComponent<any> {
    constructor (props: any) {
      super(props);

      assert(Inner, `Expected 'withApi' to wrap a React Component`);
    }

    render () {
      return (
        <ApiConsumer>
          {(apiProps: ApiProps) => {
            assert(apiProps && apiProps.api, `Application root must be wrapped inside 'rx-react/Api' to provide API context`);

            return (
              <Inner
                {...defaultProps}
                {...apiProps}
                {...this.props}
              />
            );
          }}
        </ApiConsumer>
      );
    }
  };
}
