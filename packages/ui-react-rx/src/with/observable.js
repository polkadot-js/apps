// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: This is now way more messy and way longer than it should be. Maintainability is lacking - apply some effort and split it into managable parts

import type { BareProps, ChangeProps, RxProps } from '../types';
import type { HOC, Options, DefaultProps } from './types';

import React from 'react';
import { map } from 'rxjs/operators/map';

import assert from '@polkadot/util/assert';

import intervalSubscribe from '../util/intervalSubscribe';
import isEqual from '../util/isEqual';
import triggerChange from '../util/triggerChange';
import echoTransform from './transform/echo';

type InProps<T> = BareProps & ChangeProps<T>;

type OutProps<T> = InProps<T> & RxProps<T>;

type State<T> = RxProps<T> & {
  subscriptions: Array<rxjs$ISubscription>;
}

export default function withObservable<T, ComponentProps: $Shape<OutProps<T>>, InputProps: InProps<T>> (observable: rxjs$Observable<T> | rxjs$Subject<T>, { onChange, propName = 'value', transform = echoTransform }: Options<T> = {}): HOC<T> {
  return (Component: React$ComponentType<ComponentProps>, defaultProps?: DefaultProps<T> = {}): Class<React.Component<InputProps, State<T>>> =>
    class WithObservable extends React.Component<InputProps, State<T>> {
      state: State<T>;

      constructor (props: InputProps) {
        super(props);

        assert(observable, `Component should have Observable to wrap`);
        assert(Component, `Expected 'with*' to wrap a React Component`);

        this.state = {
          rxUpdated: false,
          rxUpdatedAt: 0,
          subscriptions: [],
          value: void 0
        };
      }

      componentDidMount () {
        const subscriptions: Array<rxjs$ISubscription> = [
          observable
            .pipe(map(transform))
            .subscribe((value) => {
              this.triggerUpdate(this.props, value);
            }),
          intervalSubscribe(this)
        ];

        this.setState({
          subscriptions
        });
      }

      componentWillUnmount () {
        this.state.subscriptions.forEach((subscription) => {
          subscription.unsubscribe();
        });
      }

      triggerUpdate = (props: InProps<T>, value?: T): void => {
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
        // flowlint-next-line inexact-spread:off
        const _props = {
          ...defaultProps,
          ...this.props,
          rxUpdated,
          rxUpdatedAt,
          [propName]: value
        };

        delete _props.onChange;

        return (
          <Component {..._props} />
        );
      }
    };
}
