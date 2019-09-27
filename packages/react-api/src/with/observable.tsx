// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: Lots of duplicated code between this and withObservable, surely there is a better way of doing this?

import { CallState } from '../types';
import { HOC, Options, DefaultProps, RenderFn } from './types';

import React from 'react';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import echoTransform from '../transform/echo';
import { intervalObservable, isEqual, triggerChange } from '../util';

interface State extends CallState {
  subscriptions: any[]; // FIXME subscriptions
}

// FIXME proper types for attributes

export default function withObservable<T, P> (observable: Observable<P>, { callOnResult, propName = 'value', transform = echoTransform }: Options = {}): HOC {
  return (Inner: React.ComponentType<any>, defaultProps: DefaultProps = {}, render?: RenderFn): React.ComponentType<any> => {
    return class WithObservable extends React.Component<any, State> {
      public state: State = {
        callResult: undefined,
        callUpdated: false,
        callUpdatedAt: 0,
        subscriptions: []
      };

      public componentDidMount (): void {
        this.setState({
          subscriptions: [
            observable
              .pipe(
                map(transform),
                catchError((): Observable<any> =>
                  of(undefined)
                )
              )
              .subscribe((value: any): void =>
                this.triggerUpdate(this.props, value)
              ),
            intervalObservable(this)
          ]
        });
      }

      public componentWillUnmount (): void {
        this.state.subscriptions.forEach((subscription): void =>
          subscription.unsubscribe()
        );
      }

      private triggerUpdate = (props: any, callResult?: T): void => {
        try {
          if (isEqual(callResult, this.state.callResult)) {
            return;
          }

          triggerChange(callResult, callOnResult, props.callOnResult || defaultProps.callOnResult);

          this.setState({
            callResult,
            callUpdated: true,
            callUpdatedAt: Date.now()
          });
        } catch (error) {
          console.error(this.props, error);
        }
      }

      public render (): React.ReactNode {
        const { children } = this.props;
        const { callUpdated, callUpdatedAt, callResult } = this.state;
        const _props = {
          ...defaultProps,
          ...this.props,
          callUpdated,
          callUpdatedAt,
          [propName]: callResult
        };

        return (
          <Inner {..._props}>
            {render && render(callResult)}{children}
          </Inner>
        );
      }
    };
  };
}
