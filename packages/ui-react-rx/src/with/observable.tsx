// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// TODO: This is now way more messy and way longer than it should be. Maintainability is lacking - apply some effort and split it into managable parts

import { RxProps } from '../types';
import { HOC, Options, DefaultProps } from './types';

import React from 'react';
import { map } from 'rxjs/operators/map';

import assert from '@polkadot/util/assert';

import intervalSubscribe from '../util/intervalSubscribe';
import isEqual from '../util/isEqual';
import triggerChange from '../util/triggerChange';
import echoTransform from './transform/echo';

type State<T> = RxProps<T> & {
  subscriptions: Array<any>;
};

// FIXME Observables here are NOT any, horribly defined (leave until rx-lite decicion is made)
// FIXME proper props augmentation

export default function withObservable<T> (observable: any, options: Options<T> = {}): HOC<T> {
  const { onChange, propName = 'value', transform = echoTransform } = options;

  return (Inner: React.ComponentType<any>, defaultProps: DefaultProps<T> = {}): React.ComponentType<any> => {
    return class WithObservable extends React.Component<any, State<T>> {
      state: State<T>;

      constructor (props: any) {
        super(props);

        assert(observable, `Component should have Observable to wrap`);
        assert(Inner, `Expected 'with*' to wrap a React Component`);

        this.state = {
          rxUpdated: false,
          rxUpdatedAt: 0,
          subscriptions: [],
          value: void 0
        };
      }

      componentDidMount () {
        const subscriptions = [
          observable
            .pipe(map(transform))
            .subscribe((value: any) => {
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
          // @ts-ignore umpf
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
    };
  };
}
