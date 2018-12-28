// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: Lots of duplicated code between this and withObservable, surely there is a better way of doing this?

import { ApiProps, RxProps } from '../types';
import { HOC, Options, DefaultProps, RenderFn } from './types';

import React from 'react';
import { assert, isUndefined } from '@polkadot/util';

import { intervalTimer, isEqual, triggerChange } from '../util/index';
import echoTransform from './transform/echo';
import withApi from './api';

type State<T> = RxProps<T> & {
  apiMethod: {
    (...params: Array<any>): Promise<any>,
    unsubscribe: (subId: number) => Promise<any>
  },
  isSubscription: boolean,
  subId: number,
  timerId: number
};

type Props = ApiProps & {};

// FIXME proper types for attributes

export default function withApiPromise<T, P> (endpoint: string, { rxChange, params = [], paramProp = 'params', propName = 'value', transform = echoTransform }: Options<T> = {}): HOC<T> {
  return (Inner: React.ComponentType<any>, defaultProps: DefaultProps<T> = {}, render?: RenderFn): React.ComponentType<any> => {
    class WithPromise extends React.Component<Props, State<T>> {
      state: State<T>;

      constructor (props: Props) {
        super(props);

        const { apiPromise } = this.props;
        const [area, section, method, ...others] = endpoint.split('.');

        assert(area.length && section.length && method.length && others.length === 0, `Invalid API format, expected <area>.<section>.<method>, found ${endpoint}`);
        assert(['rpc', 'query'].includes(area), `Unknown apiPromise.${area}, expected rpc or query`);
        assert((apiPromise as any)[area][section], `Unable to find apiPromise.${area}.${section}`);

        const apiMethod = (apiPromise as any)[area][section][method];

        assert(apiMethod, `Unable to find apiPromise.${area}.${section}.${method}`);

        this.state = {
          apiMethod,
          isSubscription: area === 'query',
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
          this.subscribe(newParams);
        }
      }

      componentDidMount () {
        this.setState({
          timerId: intervalTimer(this)
        });

        this.subscribe(this.getParams(this.props));
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

      private async subscribe (newParams: Array<any>) {
        const { apiMethod, isSubscription } = this.state;

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
      }

      private unsubscribe () {
        const { apiMethod, subId } = this.state;

        if (subId !== -1) {
          apiMethod.unsubscribe(subId);
        }
      }

      private triggerUpdate (props: any, _value?: T): void {
        try {
          const value = (props.transform || transform)(_value);

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
          // ignore
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
    }

    return withApi(WithPromise);
  };
}
