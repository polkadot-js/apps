// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps, CallState, SubtractProps } from '../types';
import { Options } from './types';

import React from 'react';
import { assert, isNull, isUndefined } from '@polkadot/util';

import { isEqual, triggerChange } from '../util';
import echoTransform from '../transform/echo';
import withApi from './api';

// FIXME This is not correct, we need some junction of derive, query & consts
interface Method {
  (...params: any[]): Promise<any>;
  at: (hash: Uint8Array | string, ...params: any[]) => Promise<any>;
  meta: any;
  multi: (params: any[], cb: (value?: any) => void) => Promise<any>;
}

type ApiMethodInfo = [Method, any[], string];

type State = CallState;

const NOOP = (): void => {
  // ignore
};

export default function withCall<P extends ApiProps> (
  endpoint: string,
  {
    at,
    atProp,
    callOnResult,
    fallbacks,
    isMulti = false,
    params = [],
    paramName,
    paramPick,
    paramValid = false,
    propName,
    transform = echoTransform
  }: Options = {}): (Inner: React.ComponentType<ApiProps>) => React.ComponentType<any> {
  return (Inner: React.ComponentType<ApiProps>): React.ComponentType<SubtractProps<P, ApiProps>> => {
    class WithPromise extends React.Component<P, State> {
      public state: State = {
        callResult: void 0,
        callUpdated: false,
        callUpdatedAt: 0
      };

      private destroy?: () => void;

      private isActive: boolean = false;

      private propName: string;

      private timerId: number = -1;

      public constructor (props: P) {
        super(props);

        const [, section, method] = endpoint.split('.');

        this.propName = `${section}_${method}`;
      }

      public componentDidUpdate (prevProps: any): void {
        const oldParams = this.getParams(prevProps);
        const newParams = this.getParams(this.props);

        if (this.isActive && !isEqual(newParams, oldParams)) {
          this
            .subscribe(newParams)
            .then(NOOP)
            .catch(NOOP);
        }
      }

      public componentDidMount (): void {
        this.isActive = true;
        this.timerId = window.setInterval((): void => {
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

      public componentWillUnmount (): void {
        this.isActive = false;

        this.unsubscribe()
          .then(NOOP)
          .catch(NOOP);

        if (this.timerId !== -1) {
          clearInterval(this.timerId);
        }
      }

      private nextState (state: Partial<State>): void {
        if (this.isActive) {
          this.setState(state as State);
        }
      }

      private getParams (props: any): [boolean, any[]] {
        const paramValue = paramPick
          ? paramPick(props)
          : paramName
            ? props[paramName]
            : undefined;

        if (atProp) {
          at = props[atProp];
        }

        // When we are specifying a param and have an invalid, don't use it. For 'params',
        // we default to the original types, i.e. no validation (query app uses this)
        if (!paramValid && paramName && (isUndefined(paramValue) || isNull(paramValue))) {
          return [false, []];
        }

        const values = isUndefined(paramValue)
          ? params
          : params.concat(
            (Array.isArray(paramValue) && !(paramValue as any).toU8a)
              ? paramValue
              : [paramValue]
          );
        return [true, values];
      }

      private constructApiSection = (endpoint: string): [Record<string, Method>, string, string, string] => {
        const { api } = this.props;
        const [area, section, method, ...others] = endpoint.split('.');

        assert(area.length && section.length && method.length && others.length === 0, `Invalid API format, expected <area>.<section>.<method>, found ${endpoint}`);
        assert(['consts', 'rpc', 'query', 'derive'].includes(area), `Unknown api.${area}, expected consts, rpc, query or derive`);
        assert(!at || area === 'query', `Only able to do an 'at' query on the api.query interface`);

        const apiSection = (api as any)[area][section];

        return [
          apiSection,
          area,
          section,
          method
        ];
      }

      private getApiMethod (newParams: any[]): ApiMethodInfo {
        if (endpoint === 'subscribe') {
          const [fn, ...params] = newParams;

          return [
            fn,
            params,
            'subscribe'
          ];
        }

        const endpoints: string[] = [endpoint].concat(fallbacks || []);
        const expanded = endpoints.map(this.constructApiSection);
        const [apiSection, area, section, method] = expanded.find(([apiSection]): boolean =>
          !!apiSection
        ) || [{}, expanded[0][1], expanded[0][2], expanded[0][3]];

        assert(apiSection && apiSection[method], `Unable to find api.${area}.${section}.${method}`);

        const meta = apiSection[method].meta;

        if (area === 'query' && meta && meta.type.isMap) {
          const arg = newParams[0];

          assert((!isUndefined(arg) && !isNull(arg)) || meta.type.asMap.linked.isTrue, `${meta.name} expects one argument`);
        }

        return [
          apiSection[method],
          newParams,
          method.startsWith('subscribe') ? 'subscribe' : area
        ];
      }

      private async subscribe ([isValid, newParams]: [boolean, any[]]): Promise<void> {
        if (!isValid) {
          return;
        }

        const { api } = this.props;
        let info: ApiMethodInfo | undefined;

        await api.isReady;

        try {
          assert(at || !atProp, 'Unable to perform query on non-existent at hash');

          info = this.getApiMethod(newParams);
        } catch (error) {
          console.error(endpoint, '::', error);
        }

        if (!info) {
          return;
        }

        const [apiMethod, params, area] = info;
        const updateCb = (value?: any): void =>
          this.triggerUpdate(this.props, value);

        await this.unsubscribe();

        try {
          if (['derive', 'subscribe'].includes(area) || (area === 'query' && (!at && !atProp))) {
            this.destroy = isMulti
              ? await apiMethod.multi(params, updateCb)
              : await apiMethod(...params, updateCb);
          } else if (area === 'consts') {
            updateCb(apiMethod);
          } else {
            updateCb(
              at
                ? await apiMethod.at(at, ...params)
                : await apiMethod(...params)
            );
          }
        } catch (error) {
          // console.error(endpoint, '::', error);
        }
      }

      private async unsubscribe (): Promise<void> {
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
          // console.error(endpoint, '::', error.message);
        }
      }

      public render (): React.ReactNode {
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
