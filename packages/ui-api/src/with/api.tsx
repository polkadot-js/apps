// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '../types';
import { Subtract } from './types';

import React from 'react';
import { assert } from '@polkadot/util';

import { ApiConsumer } from '../ApiContext';

type I = ApiProps & {};

export default function withApi <P extends object, C extends React.ComponentType<P>> (Inner: C): React.ComponentClass<Subtract<P, I>> {
  return class WithApi extends React.PureComponent<Subtract<P, I>> {
    constructor (props: Subtract<P, I>) {
      super(props);

      assert(Inner, `Expected 'withApi' to wrap a React Component`);
    }

    render (): React.ReactNode {
      return (
        <ApiConsumer>
          {(apiProps: ApiProps) => {
            assert(apiProps && apiProps.apiPromise, `Application root must be wrapped inside 'rx-react/Api' to provide API context`);

            const _props = {
              ...apiProps,
              ...this.props
            } as any;

            return (
              <Inner {..._props} />
            );
          }}
        </ApiConsumer>
      );
    }
  };
}
