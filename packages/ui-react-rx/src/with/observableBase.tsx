// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: Lots of duplicated code between this and withObservable, surely there ois a better way of doing this?

import { RxProps } from '../types';
import { HOC, Options, DefaultProps, RenderFn } from './types';

import React from 'react';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { intervalSubscribe, isEqual, triggerChange } from '../util/index';
import echoTransform from './transform/echo';

type State<T> = RxProps<T> & {
  subscriptions: Array<any>; // FIXME subscriptions
};

// FIXME proper types for attributes

export default function withObservableBase<T, P> (observable: Observable<P>, { rxChange, propName = 'value', transform = echoTransform }: Options<T> = {}): HOC<T> {
  return (Inner: React.ComponentType<any>, defaultProps: DefaultProps<T> = {}, render?: RenderFn): React.ComponentType<any> => {
    return class WithObservable extends React.Component<any, State<T>> {
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

      componentDidMount () {
        this.setState({
          subscriptions: [
            observable
              .pipe(
                map(transform),
                catchError(() =>
                  of(undefined)
                )
              )
              .subscribe((value: any) =>
                this.triggerUpdate(this.props, value)
              ),
            intervalSubscribe(this)
          ]
        });
      }

      componentWillUnmount () {
        this.state.subscriptions.forEach((subscription) =>
          subscription.unsubscribe()
        );
      }

      triggerUpdate = (props: any, value?: T): void => {
        try {
          if (isEqual(value, this.state.value)) {
            return;
          }

          triggerChange(value, rxChange, props.rxChange || defaultProps.rxChange);

          this.setState({
            rxUpdated: true,
            rxUpdatedAt: Date.now(),
            value
          });
        } catch (error) {
          console.error(this.props, error);
        }
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

        return (
          <Inner {..._props}>
            {render && render(value)}{children}
          </Inner>
        );
      }
    };
  };
}
