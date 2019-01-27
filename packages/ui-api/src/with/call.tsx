// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps, CallState, Subtract } from '../types';
import { Options } from './types';

import React from 'react';
import { assert, isNull, isUndefined } from '@polkadot/util';

import { isEqual, triggerChange } from '../util/index';
import echoTransform from '../transform/echo';
import withApi from './api';

interface Method {
  (...params: Array<any>): Promise<any>;
  at: (hash: Uint8Array | string, ...params: Array<any>) => Promise<any>;
}

type State = CallState;

const NOOP = () => {
  // ignore
};

export default function withCall<P extends ApiProps> (endpoint: string, { at, atProp, callOnResult, params = [], paramName = 'params', propName, transform = echoTransform }: Options = {}): (Inner: React.ComponentType<ApiProps>) => React.ComponentType<any> {
  return (Inner: React.ComponentType<ApiProps>): React.ComponentType<Subtract<P, ApiProps>> => {
    class WithPromise extends React.Component<P, State> {
      state: State;
      private destroy?: () => void;
      private isActive: boolean = false;
      private propName: string;
      private timerId: number = -1;

      constructor (props: P) {
        super(props);

        const [, section, method] = endpoint.split('.');

        this.propName = `${section}_${method}`;
        this.state = {
          callResult: void 0,
          callUpdated: false,
          callUpdatedAt: 0
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
        this.isActive = true;
        this.timerId = window.setInterval(() => {
          const elapsed = Date.now() - (this.state.callUpdatedAt || 0);
          const callUpdated = elapsed <= 1500;

          if (callUpdated !== this.state.callUpdated) {
            this.nextState({ callUpdated });
          }
        }, 500);

        this
          .subscribe(this.getParams(this.props))
          .then(NOOP)
          .catch(NOOP);
      }

      componentWillUnmount () {
        this.isActive = false;

        this.unsubscribe()
          .then(NOOP)
          .catch(NOOP);

        if (this.timerId !== -1) {
          clearInterval(this.timerId);
        }
      }

      private nextState (state: Partial<State>) {
        if (this.isActive) {
          this.setState(state as State);
        }
      }

      private getParams (props: any): Array<any> {
        const paramValue = props[paramName];

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
        const { api } = this.props;

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

        const apiSection = (api as any)[area][section];

        assert(apiSection && apiSection[method], `Unable to find api.${area}.${section}.${method}`);

        const meta = apiSection[method].meta;

        if (area === 'query' && meta && meta.type.isMap) {
          const arg = newParams[0];

          assert(!isUndefined(arg) && !isNull(arg), `${meta.name} expects one argument`);
        }

        return [
          apiSection[method],
          newParams,
          area === 'derive' || (area === 'query' && (!at && !atProp)) || method.startsWith('subscribe')
        ];
      }

      private async subscribe (newParams: Array<any>) {
        const { api } = this.props;

        await api.isReady;

        try {
          const [apiMethod, params, isSubscription] = this.getApiMethod(newParams);

          assert(at || !atProp, 'Unable to perform query on non-existent at hash');

          await this.unsubscribe();

          if (isSubscription) {
            this.destroy = await apiMethod(...params, (value?: any) =>
              this.triggerUpdate(this.props, value)
            );
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

      private async unsubscribe () {
        if (this.destroy) {
          this.destroy();
          this.destroy = undefined;
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
          [propName || this.propName]: callResult
        };

        return (
          <Inner {..._props} />
        );
      }
    }

    return withApi(WithPromise);
  };
}
