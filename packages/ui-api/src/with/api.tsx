// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Diff } from 'utility-types';
import { ApiProps } from '../types';

import React from 'react';
import { assert } from '@polkadot/util';

import { ApiConsumer } from '../ApiContext';

export default function withApi <P extends object, W = Diff<P, ApiProps>> (Inner: React.ComponentType<P>): React.ComponentClass<W> {
  return class WithApi extends React.PureComponent<W> {
    constructor (props: W) {
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

// type TestProps = ApiProps & {
//   something: any
// };

// @withApi
// class Test<P = TestProps> extends React.PureComponent<P> {
//   render (): React.ReactNode {
//     return 'test';
//   }
// }
