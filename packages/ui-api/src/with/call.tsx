// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps, RxProps } from '../types';
import { HOC, Options } from './types';

import React from 'react';
import { assert, isUndefined } from '@polkadot/util';

import derive from '../derive/index';
import { intervalTimer, isEqual, triggerChange } from '../util/index';
import echoTransform from '../transform/echo';
import withApi from './api';

interface Method {
  (...params: Array<any>): Promise<any>;
  at: (hash: Uint8Array | string, ...params: Array<any>) => Promise<any>;
}

type State<T> = RxProps<T> & {
  destroy?: () => void,
  propName: string,
  timerId: number
};

const NOOP = () => {
  // ignore
};

export default function withCall<T, P extends ApiProps> (endpoint: string, { at, atProp, rxChange, params = [], paramProp = 'params', propName, transform = echoTransform }: Options<T> = {}): HOC<T> {
  return (Inner: React.ComponentType<ApiProps>): React.ComponentType<any> => {
    class WithPromise extends React.Component<P, State<T>> {
      state: State<T>;

      constructor (props: P) {
        super(props);

        const [area, section, method] = endpoint.split('.');

        this.state = {
          propName: `${area}_${section}_${method}`,
          rxUpdated: false,
          rxUpdatedAt: 0,
          timerId: -1,
          value: void 0
        };
      }

      componentDidUpdate (prevProps: any) {
        const newParams = this.getParams(this.props);
        const oldParams = this.getParams(prevProps);

        if (!isEqual(newParams, oldParams)) {
          this
            .subscribe(newParams)
            .then(NOOP)
            .catch(NOOP);
        }
      }

      componentDidMount () {
        this.setState({
          timerId: intervalTimer(this)
        });

        this
          .subscribe(this.getParams(this.props))
          .then(NOOP)
          .catch(NOOP);
      }

      componentWillUnmount () {
        const { timerId } = this.state;

        if (timerId !== -1) {
          clearInterval(timerId);
        }

        this.unsubscribe();
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

        if (area === 'derive') {
          const apiSection = (derive as any)[section];

          assert(apiSection && apiSection[method], `Unable to find api.derive.${section}.${method}`);

          return [
            apiSection[method](apiPromise),
            newParams,
            true
          ];
        }

        const apiSection = (apiPromise as any)[area][section];

        assert(apiSection && apiSection[method], `Unable to find api.${area}.${section}.${method}`);

        return [
          apiSection[method],
          newParams,
          (area === 'query' && (!at && !atProp)) || method.startsWith('subscribe')
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
            const destroy = await apiMethod(...params, (value?: T) =>
              this.triggerUpdate(this.props, value)
            );

            this.setState({ destroy });
          } else {
            const value: T = at
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

      private triggerUpdate (props: any, _value?: T): void {
        try {
          const value = (props.transform || transform)(_value);

          if (isEqual(value, this.state.value)) {
            return;
          }

          triggerChange(value, rxChange, props.rxChange);

          this.setState({
            rxUpdated: true,
            rxUpdatedAt: Date.now(),
            value
          });
        } catch (error) {
          console.error(endpoint, '::', error.message);
        }
      }

      render () {
        const { rxUpdated, rxUpdatedAt, value } = this.state;
        const _props = {
          ...this.props,
          rxUpdated,
          rxUpdatedAt,
          [propName || this.state.propName]: value
        };

        return (
          <Inner {..._props} />
        );
      }
    }

    return withApi(WithPromise);
  };
}
