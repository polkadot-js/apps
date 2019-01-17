// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps, CallProps } from '../types';
import { HOC, Options } from './types';

import React from 'react';
import { assert, isUndefined } from '@polkadot/util';

import { isEqual, triggerChange } from '../util/index';
import echoTransform from '../transform/echo';
import withApi from './api';

interface Method {
  (...params: Array<any>): Promise<any>;
  at: (hash: Uint8Array | string, ...params: Array<any>) => Promise<any>;
}

type State = CallProps & {
  destroy?: () => void,
  propName: string,
  timerId: number
};

const NOOP = () => {
  // ignore
};

export default function withCall<P extends ApiProps> (endpoint: string, { at, atProp, callOnResult, params = [], paramProp = 'params', propName, transform = echoTransform }: Options = {}): HOC {
  return (Inner: React.ComponentType<ApiProps>): React.ComponentType<any> => {
    class WithPromise extends React.Component<P, State> {
      state: State;
      isActive: boolean = true;

      constructor (props: P) {
        super(props);

        const [area, section, method] = endpoint.split('.');

        this.state = {
          propName: `${area}_${section}_${method}`,
          callResult: void 0,
          callUpdated: false,
          callUpdatedAt: 0,
          timerId: -1
        };
      }

      componentDidUpdate (prevProps: any) {
        const newParams = this.getParams(this.props);
        const oldParams = this.getParams(prevProps);

        if (this.isActive && !isEqual(newParams, oldParams)) {
          this
            .subscribe(newParams)
            .then(NOOP)
            .catch(NOOP);
        }
      }

      componentDidMount () {
        const timerId = window.setInterval(() => {
          const elapsed = Date.now() - (this.state.callUpdatedAt || 0);
          const callUpdated = elapsed <= 1500;

          if (callUpdated !== this.state.callUpdated) {
            this.nextState({ callUpdated });
          }
        }, 500);

        this.nextState({
          timerId
        });

        this
          .subscribe(this.getParams(this.props))
          .then(NOOP)
          .catch(NOOP);
      }

      componentWillUnmount () {
        const { timerId } = this.state;

        this.isActive = false;

        if (timerId !== -1) {
          clearInterval(timerId);
        }

        this.unsubscribe();
      }

      private nextState (state: Partial<State>) {
        if (this.isActive) {
          this.setState(state as State);
        }
      }

      private getParams (props: any): Array<any> {
        const paramValue = props[paramProp];

        if (atProp) {
          at = props[atProp];
        }

        return isUndefined(paramValue)
          ? params
          : params.concat(
            Array.isArray(paramValue)
              ? paramValue
              : [paramValue]
          );
      }

      private getApiMethod (newParams: Array<any>): [Method, Array<any>, boolean] {
        const { apiPromise } = this.props;

        if (endpoint === 'subscribe') {
          const [fn, ...params] = newParams;

          return [
            fn,
            params,
            true
          ];
        }

        const [area, section, method, ...others] = endpoint.split('.');

        assert(area.length && section.length && method.length && others.length === 0, `Invalid API format, expected <area>.<section>.<method>, found ${endpoint}`);
        assert(['rpc', 'query', 'derive'].includes(area), `Unknown api.${area}, expected rpc, query or derive`);
        assert(!at || area === 'query', 'Only able todo an at query on the api.query interface');

        const apiSection = (apiPromise as any)[area][section];

        assert(apiSection && apiSection[method], `Unable to find api.${area}.${section}.${method}`);

        return [
          apiSection[method],
          newParams,
          area === 'derive' || (area === 'query' && (!at && !atProp)) || method.startsWith('subscribe')
        ];
      }

      private async subscribe (newParams: Array<any>) {
        const { apiPromise } = this.props;

        await apiPromise.isReady;

        try {
          const [apiMethod, params, isSubscription] = this.getApiMethod(newParams);

          assert(at || !atProp, 'Unable to perform query on non-existent at hash');

          this.unsubscribe();

          if (isSubscription) {
            const destroy = await apiMethod(...params, (value?: any) =>
              this.triggerUpdate(this.props, value)
            );

            this.nextState({ destroy });
          } else {
            const value: any = at
              ? await apiMethod.at(at, ...params)
              : await apiMethod(...params);

            this.triggerUpdate(this.props, value);
          }
        } catch (error) {
          // console.error(endpoint, '::', error);
        }
      }

      private unsubscribe () {
        const { destroy } = this.state;

        if (destroy) {
          destroy();
        }
      }

      private triggerUpdate (props: any, value?: any): void {
        try {
          const callResult = (props.transform || transform)(value);

          if (!this.isActive || isEqual(callResult, this.state.callResult)) {
            return;
          }

          triggerChange(callResult, callOnResult, props.callOnResult);

          this.nextState({
            callResult,
            callUpdated: true,
            callUpdatedAt: Date.now()
          });
        } catch (error) {
          console.error(endpoint, '::', error.message);
        }
      }

      render () {
        const { callUpdated, callUpdatedAt, callResult } = this.state;
        const _props = {
          ...this.props,
          callUpdated,
          callUpdatedAt,
          [propName || this.state.propName]: callResult
        };

        return (
          <Inner {..._props} />
        );
      }
    }

    return withApi(WithPromise);
  };
}
