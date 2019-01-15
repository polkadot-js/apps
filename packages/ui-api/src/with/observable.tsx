// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: Lots of duplicated code between this and withObservable, surely there is a better way of doing this?

import { CallState } from '../types';
import { Options, DefaultProps, RenderFn } from './types';

import React from 'react';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import echoTransform from '../transform/echo';
import { intervalObservable, isEqual, triggerChange } from '../util/index';

type HOC = (Component: React.ComponentType<any>, defaultProps?: DefaultProps, render?: RenderFn) => React.ComponentType<any>;

type State = CallState & {
  subscriptions: Array<any>; // FIXME subscriptions,
  value?: any
};

// FIXME proper types for attributes

export default function withObservable<P> (observable: Observable<P>, { callOnChange, propName = 'value', transform = echoTransform }: Options = {}): HOC {
  return (Inner: React.ComponentType<any>, defaultProps: DefaultProps = {}, render?: RenderFn): React.ComponentType<any> => {
    return class WithObservable extends React.Component<any, State> {
      state: State;

      constructor (props: any) {
        super(props);

        this.state = {
          callUpdated: false,
          callUpdatedAt: 0,
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
            intervalObservable(this)
          ]
        });
      }

      componentWillUnmount () {
        this.state.subscriptions.forEach((subscription) =>
          subscription.unsubscribe()
        );
      }

      triggerUpdate = (props: any, value?: any): void => {
        try {
          if (isEqual(value, this.state.value)) {
            return;
          }

          triggerChange(value, callOnChange, props.callOnChange || defaultProps.callOnChange);

          this.setState({
            callUpdated: true,
            callUpdatedAt: Date.now(),
            value
          });
        } catch (error) {
          console.error(this.props, error);
        }
      }

      render () {
        const { children } = this.props;
        const { callUpdated, callUpdatedAt, value } = this.state;
        const _props = {
          ...defaultProps,
          ...this.props,
          callUpdated,
          callUpdatedAt,
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
