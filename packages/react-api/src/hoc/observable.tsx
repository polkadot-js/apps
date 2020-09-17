// Copyright 2017-2020 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

// TODO: Lots of duplicated code between this and withObservable, surely there is a better way of doing this?

import { CallState } from '../types';
import { HOC, Options, DefaultProps, RenderFn } from './types';

import React from 'react';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import echoTransform from '../transform/echo';
import { intervalObservable, isEqual, triggerChange } from '../util';

interface State extends CallState {
  subscriptions: { unsubscribe: () => void }[];
}

export default function withObservable<T, P> (observable: Observable<P>, { callOnResult, propName = 'value', transform = echoTransform }: Options = {}): HOC {
  return (Inner: React.ComponentType<any>, defaultProps: DefaultProps = {}, render?: RenderFn): React.ComponentType<any> => {
    return class WithObservable extends React.Component<any, State> {
      private isActive = true;

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
                catchError(() => of(undefined))
              )
              .subscribe((value: any) => this.triggerUpdate(this.props, value)),
            intervalObservable(this)
          ]
        });
      }

      public componentWillUnmount (): void {
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
      }

      public render (): React.ReactNode {
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
    };
  };
}
