// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: Lots of duplicated code between this and withObservable, surely there is a better way of doing this?

import { ApiProps, RxProps } from '../types';
import { HOC, Options } from './types';

import React from 'react';
import { assert, isUndefined } from '@polkadot/util';

import derive from '../derive/index';
import { intervalTimer, isEqual, triggerChange } from '../util/index';
import echoTransform from './transform/echo';
import withApi from './api';

type State<T> = RxProps<T> & {
  propName: string,
  subId: number,
  timerId: number
};

type Props = ApiProps & {};

// FIXME proper types for attributes

export default function withApiPromise<T, P> (endpoint: string, { rxChange, params = [], paramProp = 'params', propName, transform = echoTransform }: Options<T> = {}): HOC<T> {
  return (Inner: React.ComponentType<any>): React.ComponentType<any> => {
    class WithPromise extends React.Component<Props, State<T>> {
      state: State<T>;

      constructor (props: Props) {
        super(props);

        const [area, section, method] = endpoint.split('.');

        this.state = {
          propName: `${area}_${section}_${method}`,
          rxUpdated: false,
          rxUpdatedAt: 0,
          subId: -1,
          timerId: -1,
          value: void 0
        };
      }

      componentDidUpdate (prevProps: any) {
        const newParams = this.getParams(this.props);

        if (!isEqual(newParams, this.getParams(prevProps))) {
          this
            .subscribe(newParams)
            .then(() => {
              // ignore
            })
            .catch(() => {
              // ignore
            });
        }
      }

      componentDidMount () {
        this.setState({
          timerId: intervalTimer(this)
        });

        this
          .subscribe(this.getParams(this.props))
          .then(() => {
            // ignore
          })
          .catch(() => {
            // ignore
          });
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

        return isUndefined(paramValue)
          ? params
          : params.concat(
            Array.isArray(paramValue)
              ? paramValue
              : [paramValue]
          );
      }

      private getApiMethod () {
        const { apiPromise } = this.props;
        const [area, section, method, ...others] = endpoint.split('.');
        const api = apiPromise as any;

        assert(area.length && section.length && method.length && others.length === 0, `Invalid API format, expected <area>.<section>.<method>, found ${endpoint}`);
        assert(['rpc', 'query', 'derive'].includes(area), `Unknown api.${area}, expected rpc, query or derive`);

        if (area === 'derive') {
          assert((derive as any)[section] && (derive as any)[section][method], `Unable to find api.derive.${section}.${method}`);

          return [
            (derive as any)[section][method](apiPromise).subscribe,
            true
          ];
        }

        assert(api[area][section] && api[area][section][method], `Unable to find api.${area}.${section}.${method}`);

        return [
          api[area][section][method],
          area === 'query' || method.startsWith('subscribe')
        ];
      }

      private async subscribe (newParams: Array<any>) {
        const { apiPromise } = this.props;

        await apiPromise.isReady;

        try {
          const [apiMethod, isSubscription] = this.getApiMethod();

          this.unsubscribe();

          if (isSubscription) {
            const subId = await apiMethod(...newParams, (value?: T) => {
              this.triggerUpdate(this.props, value);
            });

            this.setState({ subId });
          } else {
            const value: T = await apiMethod(...newParams);

            this.triggerUpdate(this.props, value);
          }
        } catch (error) {
          console.error(error.message);
        }
      }

      private unsubscribe () {
        const { apiPromise } = this.props;
        const { subId } = this.state;

        if (subId !== -1) {
          const [area, section, method] = endpoint.split('.');
          const apiMethod = area === 'derive'
            ? (derive as any)[section][method](apiPromise)
            : (apiPromise as any)[area][section][method];

          apiMethod.unsubscribe(subId);
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
          console.error(error.message);
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
