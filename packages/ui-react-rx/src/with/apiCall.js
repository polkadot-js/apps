// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface$Method } from '@polkadot/api-rx/types';
import type { ApiProps, BareProps, ChangeProps, ParamProps, RxProps } from '../types';
import type { ApiMethod, HOC, Options, DefaultProps } from './types';

import React from 'react';
import assert from '@polkadot/util/assert';

import isEqual from '../util/isEqual';
import withObservable from './observable';
import withApi from './api';

type InProps<T> = BareProps & ChangeProps<T> & ParamProps;

type WithApiProps<T> = InProps<T> & ApiProps;

type OutProps<T> = WithApiProps<T> & RxProps<T>;

type State<ComponentProps> = ParamProps & {
  Component: React$ComponentType<ComponentProps>,
  fn: RxApiInterface$Method
}

export default function withApiCall<T, ComponentProps: $Shape<OutProps<T>>, InputProps: InProps<T>, InputApiProps: WithApiProps<T>> ({ name, section }: ApiMethod, options?: Options<T>): HOC<T> {
  return (Component: React$ComponentType<ComponentProps>, defaultProps?: DefaultProps<T> = {}): Class<React.Component<InputProps>> => {
    class WithApiCall extends React.Component<InputApiProps, State<InputApiProps>> {
      state: State<InputApiProps>;

      constructor (props: InputApiProps) {
        super(props);

        const hasSection = !!section;

        assert(!hasSection || props.api[section], `Unable to find 'api.${section}'`);

        const fn: RxApiInterface$Method = hasSection
          ? props.api[section][name]
          // $FlowFixMe method check to be done
          : ((props.api[name]: any): RxApiInterface$Method);

        assert(fn, `Unable to find 'api${hasSection ? '.' : ''}${section || ''}.${name}'`);

        this.state = ({ fn }: $Shape<State<InputApiProps>>);
      }

      static getDerivedStateFromProps ({ params = [] }: InputApiProps, prevState: State<ComponentProps>): $Shape<State<InputApiProps>> | null {
        if (isEqual(params, prevState.params)) {
          return null;
        }

        const observable = prevState.fn.apply(null, params);

        return {
          Component: withObservable(observable, options)(Component, defaultProps),
          params
        };
      }

      render () {
        const { Component } = this.state;

        return (
          <Component {...this.props} />
        );
      }
    }

    return withApi(WithApiCall);
  };
}
