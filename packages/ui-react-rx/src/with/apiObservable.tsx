// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// TODO: Lots of duplicated code between this and withObservable, surely there ois a better way of doing this?

import { RxProps, ObservableApiInterface } from '../types';
import { HOC, StorageOptions, DefaultProps } from './types';

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

type ObservableNames = keyof ObservableApiInterface;

// FIXME proper types for attributes

export default function withApiObservable<T> (observable: ObservableNames, { onChange, params, paramProp = 'params', propName = 'value', transform = echoTransform }: StorageOptions<T> = {}): HOC<T> {
  return (Inner: React.ComponentType<any>, defaultProps: DefaultProps<T> = {}): React.ComponentType<any> => {
    class WithStorage extends React.Component<any, State<T>> {
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

      componentDidUpdate (prevProps: any) {
        if (!isEqual(this.props[paramProp], prevProps[paramProp])) {
          this.subscribe();
        }
      }

      componentDidMount () {
        this.subscribe();
      }

      private subscribe () {
        const { apiObservable } = this.props;
        const propValue = params || this.props[paramProp];

        this.unsubscribe();

        if (isUndefined(propValue)) {
          return;
        }

        this.setState({
          subscriptions: [
            apiObservable[observable](propValue)
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
          <Inner {..._props} />
        );
      }
    }

    return withApi(WithStorage);
  };
}
