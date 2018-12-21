// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: Lots of duplicated code between this and withObservable, surely there ois a better way of doing this?

import { ApiFunctions } from '@polkadot/api-observable/types';
import { RxProps } from '../types';
import { HOC, Options, DefaultProps, RenderFn } from './types';

import React from 'react';
import { isUndefined } from '@polkadot/util';

import { isEqual } from '../util/index';
import echoTransform from './transform/echo';
import withApi from './api';
import withObservableBase from './observableBase';

type State<T> = RxProps<T> & {
  Component?: React.ComponentType<any>
};

// FIXME proper types for attributes

export default function withObservable<T> (subscription: ApiFunctions, { rxChange, params = [], paramProp = 'params', propName = subscription, transform = echoTransform }: Options<T> = {}): HOC<T> {
  return (Inner: React.ComponentType<any>, defaultProps: DefaultProps<T> = {}, render?: RenderFn): React.ComponentType<any> => {
    class WithObservable extends React.Component<any, State<T>> {
      state: State<T>;

      constructor (props: any) {
        super(props);

        this.state = {};
      }

      private getParams (props: any): Array<any> {
        const paramValue = props[paramProp];

        return isUndefined(paramValue)
          ? params
          : params.concat(
            Array.isArray(paramValue)
              ? paramValue
              : [paramValue]
          );
      }

      componentDidUpdate (prevProps: any) {
        const newParams = this.getParams(this.props);

        if (!isEqual(newParams, this.getParams(prevProps))) {
          this.subscribe(newParams);
        }
      }

      componentDidMount () {
        this.subscribe(this.getParams(this.props));
      }

      componentWillUnmount () {
        this.setState({
          Component: undefined
        });
      }

      private subscribe (newParams: Array<any>) {
        try {
          const { apiObservable } = this.props;
          const observable = apiObservable[subscription](...newParams);

          this.setState({
            Component: withObservableBase(observable, {
              rxChange,
              propName,
              transform
            })(Inner, defaultProps, render)
          });
        } catch (error) {
          console.error('withObservable:subscribe', subscription, error);

          throw error;
        }
      }

      render () {
        const { Component } = this.state;

        if (!Component) {
          return null;
        }

        return (
          <Component {...this.props} />
        );
      }
    }

    return withApi(WithObservable);
  };
}
