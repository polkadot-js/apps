// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// TODO: Lots of duplicated code between this and withObservable, surely there ois a better way of doing this?

import { RxProps, ObservableApiNames } from '../types';
import { HOC, Options, DefaultProps, RenderFn } from './types';

import React from 'react';
import { map } from 'rxjs/operators/map';
import isUndefined from '@polkadot/util/is/undefined';

import intervalSubscribe from '../util/intervalSubscribe';
import isEqual from '../util/isEqual';
import triggerChange from '../util/triggerChange';
import echoTransform from './transform/echo';
import withApi from './api';

type State<T> = RxProps<T> & {
  subscriptions: Array<any>; // FIXME subscriptions
};

// FIXME proper types for attributes

export default function withObservable<T> (observable: ObservableApiNames, { onChange, params = [], paramProp = 'params', propName = observable, transform = echoTransform }: Options<T> = {}): HOC<T> {
  console.log('observable', observable, paramProp);

  return (Inner: React.ComponentType<any>, defaultProps: DefaultProps<T> = {}, render?: RenderFn): React.ComponentType<any> => {
    class WithObservable extends React.Component<any, State<T>> {
      state: State<T>;

      constructor (props: any) {
        super(props);

        this.state = {
          rxUpdated: false,
          rxUpdatedAt: 0,
          subscriptions: [],
          value: void 0
        };
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

      private subscribe (newParams: Array<any>) {
        const { apiObservable } = this.props;

        this.unsubscribe();
        this.setState({
          subscriptions: [
            apiObservable[observable](...newParams)
              .pipe(map(transform))
              .subscribe((value: any) =>
                this.triggerUpdate(this.props, value)
              ),
            intervalSubscribe(this)
          ]
        });
      }

      private unsubscribe () {
        this.state.subscriptions.forEach((subscription) =>
          subscription.unsubscribe()
        );
      }

      componentWillUnmount () {
        this.unsubscribe();
      }

      triggerUpdate = (props: any, value?: T): void => {
        if (isEqual(value, this.state.value)) {
          return;
        }

        triggerChange(value, onChange, props.onChange || defaultProps.onChange);

        this.setState({
          rxUpdated: true,
          rxUpdatedAt: Date.now(),
          value
        });
      }

      render () {
        const { children } = this.props;
        const { rxUpdated, rxUpdatedAt, value } = this.state;
        const _props = {
          ...defaultProps,
          ...this.props,
          rxUpdated,
          rxUpdatedAt,
          [propName]: value
        };

        delete _props.onChange;

        return (
          <Inner {..._props}>
            {render && render(value)}{children}
          </Inner>
        );
      }
    }

    return withApi(WithObservable);
  };
}
