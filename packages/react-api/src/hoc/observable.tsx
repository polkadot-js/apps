// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

// TODO: Lots of duplicated code between this and withObservable, surely there is a better way of doing this?

import type { Observable, OperatorFunction } from 'rxjs';
import type { CallState } from '../types';
import type { DefaultProps, HOC, Options, RenderFn } from './types';

import React from 'react';
import { catchError, map, of } from 'rxjs';

import echoTransform from '../transform/echo';
import { intervalObservable, isEqual, triggerChange } from '../util';

interface State extends CallState {
  subscriptions: { unsubscribe: () => void }[];
}

export default function withObservable<T, P> (observable: Observable<P>, { callOnResult, propName = 'value', transform = echoTransform }: Options = {}): HOC {
  return (Inner: React.ComponentType<any>, defaultProps: DefaultProps = {}, render?: RenderFn): React.ComponentType<any> => {
    class WithObservable extends React.Component<any, State> {
      private isActive = true;

      public override state: State = {
        callResult: undefined,
        callUpdated: false,
        callUpdatedAt: 0,
        subscriptions: []
      };

      public override componentDidMount (): void {
        this.setState({
          subscriptions: [
            observable
              .pipe(
                map(transform) as OperatorFunction<P, any>,
                catchError(() => of(undefined))
              )
              .subscribe((value) => this.triggerUpdate(this.props, value as T)),
            intervalObservable(this)
          ]
        });
      }

      public override componentWillUnmount (): void {
        this.isActive = false;
        this.state.subscriptions.forEach((subscription): void =>
          subscription.unsubscribe()
        );
      }

      private triggerUpdate = (props: P, callResult?: T): void => {
        try {
          if (!this.isActive || isEqual(callResult, this.state.callResult)) {
            return;
          }

          triggerChange(callResult, callOnResult, (props as Options).callOnResult || defaultProps.callOnResult);

          this.setState({
            callResult,
            callUpdated: true,
            callUpdatedAt: Date.now()
          });
        } catch (error) {
          console.error(this.props, error);
        }
      };

      public override render (): React.ReactNode {
        const { children } = this.props;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { callResult, callUpdated, callUpdatedAt } = this.state;
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
    }

    return WithObservable;
  };
}
