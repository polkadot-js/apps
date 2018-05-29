// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ApiProps, BareProps, ChangeProps } from '../types';
import type { DefaultProps } from './types';

import React from 'react';
import assert from '@polkadot/util/assert';

import Api from '../Api';

type InProps<T> = BareProps & ChangeProps<T>;

type OutProps<T> = InProps<T> & ApiProps;

export default function withApi<T, ComponentProps: $Shape<OutProps<T>>, InputProps: InProps<T>> (Component: React$ComponentType<ComponentProps>, defaultProps?: DefaultProps<T> = {}): Class<React.Component<InputProps>> {
  return class WithApi extends React.Component<InputProps> {
    constructor (props: InputProps) {
      super(props);

      assert(Component, `Expected 'withApi' to wrap a React Component`);
    }

    render () {
      return (
        <Api.Consumer>
          {(apiProps?: ApiProps): React$Node => {
            assert(apiProps && apiProps.api, `Application root must be wrapped inside 'rx-react/Api' to provide API context`);

            return (
              // flowlint-next-line inexact-spread:off
              <Component
                {...defaultProps}
                {...apiProps}
                {...this.props}
              />
            );
          }}
        </Api.Consumer>
      );
    }
  };
}
