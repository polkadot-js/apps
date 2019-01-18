// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps, CallProps, CallState } from './types';
import { Options } from './with/types';

import React from 'react';
import { assert, isUndefined } from '@polkadot/util';

import { isEqual, triggerChange } from './util/index';
import echoTransform from './transform/echo';
import withApi from './with/api';

interface Method {
  (...params: Array<any>): Promise<any>;
  at: (hash: Uint8Array | string, ...params: Array<any>) => Promise<any>;
}

type Props = ApiProps & Options & {
  call: string,
  children (props: CallProps): JSX.Element;
};

type State = CallState & {
  destroy?: () => void,
  propName: string,
  timerId: number
};

const NOOP = () => {
  // ignore
};

class ApiCall extends React.PureComponent<Props, State> {
  state: State;
  isActive: boolean = true;

  constructor (props: Props) {
    super(props);

    const { call } = this.props;
    const [area, section, method] = call.split('.');

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
    const { params = [] } = this.props;

    return Array.isArray(params)
      ? params
      : [params];
  }

  private getApiMethod (newParams: Array<any>): [Method, Array<any>, boolean] {
    const { api, at, call } = this.props;

    if (call === 'subscribe') {
      const [fn, ...params] = newParams;

      return [
        fn,
        params,
        true
      ];
    }

    const [area, section, method, ...others] = call.split('.');

    assert(area.length && section.length && method.length && others.length === 0, `Invalid API format, expected <area>.<section>.<method>, found ${call}`);
    assert(['rpc', 'query', 'derive'].includes(area), `Unknown api.${area}, expected rpc, query or derive`);
    assert(isUndefined(at) && area !== 'query', 'Only able todo an at query on the api.query interface');

    const apiSection = (api as any)[area][section];

    assert(apiSection && apiSection[method], `Unable to find api.${area}.${section}.${method}`);

    return [
      apiSection[method],
      newParams,
      area === 'derive' || (area === 'query' && isUndefined(at)) || method.startsWith('subscribe')
    ];
  }

  private async subscribe (newParams: Array<any>) {
    const { api, at } = this.props;

    await api.isReady;

    try {
      const [apiMethod, params, isSubscription] = this.getApiMethod(newParams);

      this.unsubscribe();

      if (isSubscription) {
        const destroy = await apiMethod(...params, (value?: any) =>
          this.triggerUpdate(this.props, value)
        );

        this.nextState({ destroy });
      } else {
        const value: any = isUndefined(at)
          ? await apiMethod(...params)
          : await apiMethod.at(at, ...params);

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

  private triggerUpdate (props: Props, value?: any): void {
    const { call, callOnResult, transform = echoTransform } = props;

    try {
      const callResult = transform(value, 0);

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
      console.error(call, '::', error.message);
    }
  }

  render () {
    const { api, apiDefaultTx, isApiConnected, isApiReady, setApiUrl } = this.props;
    const { callResult, callUpdated, callUpdatedAt } = this.state;

    return this.props.children({
      api,
      apiDefaultTx,
      isApiConnected,
      isApiReady,
      setApiUrl,
      callResult,
      callUpdated,
      callUpdatedAt
    });
  }
}

export default withApi(ApiCall);
