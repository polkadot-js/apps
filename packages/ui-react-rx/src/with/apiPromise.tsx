// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: Lots of duplicated code between this and withObservable, surely there is a better way of doing this?

import { ApiProps, RxProps } from '../types';
import { HOC, Options, DefaultProps, RenderFn } from './types';

import React from 'react';
import { assert } from '@polkadot/util';

import { intervalTimer, isEqual, triggerChange } from '../util/index';
import echoTransform from './transform/echo';
import withApi from './api';

type State<T> = RxProps<T> & {
  apiMethod: {
    () => Promise<number>,
  subId: number,
  timerId: number
};

type Props = ApiProps & {};

// FIXME proper types for attributes

export default function withApiPromise<T, P> (endpoint: string, { rxChange, propName = 'value', transform = echoTransform }: Options<T> = {}): HOC<T> {
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
          rxUpdated: false,
          rxUpdatedAt: 0,
          subId: -1,
          timerId: -1,
          value: void 0
        };
      }

      static getDerivedStateFromProps (props: Props, prevState: State<T>): Partial<State<T>> | null {
        return null;
      }

      componentDidMount () {
        const { apiMethod } = this.state;

        this.setState({
          timerId: intervalTimer(this)
        });

        (async () => {
          try {
            const value = await apiMethod();
          } catch (error) {
            // invalid promise
          }
        })();
      }

      componentWillUnmount () {
        const { subId, timerId } = this.state;

        if (timerId !== -1) {
          clearInterval(timerId);
        }

        if (subId !== -1) {
          // TODO unsub
        }
      }

      private triggerUpdate = (props: any, value?: T): void => {
        try {
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
          console.error(this.props, error);
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
