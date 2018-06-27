// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { RxApiInterface$Method } from '@polkadot/api-rx/types';
import { ParamProps } from '../types';
import { ApiMethod, HOC, Options, DefaultProps } from './types';

import React from 'react';
import assert from '@polkadot/util/assert';

import isEqual from '../util/isEqual';
import withObservable from './observable';
import withApi from './api';

type State = ParamProps & {
  Component: React.ComponentType<any>,
  fn: RxApiInterface$Method
};

// FIXME properly type input and agumented props, e.g. P extends object (in) & P & AugProps (out)

export default function withApiCall<T> ({ name, section }: ApiMethod, options?: Options<T>): HOC<T> {
  return (Component: React.ComponentType<any>, defaultProps: DefaultProps<T> = {}): React.ComponentType<any> => {
    class WithApiCall extends React.Component<any, State> {
      state: State;

      constructor (props: any) {
        super(props);

        assert(section && props.api[section], `Unable to find 'api.${section}'`);

        const fn: RxApiInterface$Method = section
          ? props.api[section][name]
          : ((props.api[name]) as RxApiInterface$Method);

        assert(fn, `Unable to find 'api${section ? '.' : ''}${section || ''}.${name}'`);

        this.state = { fn } as State;
      }

      static getDerivedStateFromProps ({ params = [] }: any, prevState: State): State | null {
        if (isEqual(params, prevState.params)) {
          return null;
        }

        const observable = prevState.fn.apply(null, params);

        return {
          Component: withObservable(observable, options)(Component, defaultProps),
          params
        } as State;
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
