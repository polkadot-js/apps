// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { RpcRxInterface } from '@polkadot/rpc-rx/types';
import { ApiProps } from '../types';

import React from 'react';
import Api from '@polkadot/api-observable';
import defaults from '@polkadot/rpc-provider/defaults';
import WsProvider from '@polkadot/rpc-provider/ws';
import RxApi from '@polkadot/rpc-rx';
import { Header } from '@polkadot/types';

import ApiContext from './Context';

type Props = {
  api?: RpcRxInterface,
  children: any, // node?
  provider?: ProviderInterface,
  url?: string
};

type State = ApiProps & {
  subscriptions: Array<any> // rxjs$ISubscription | null>;
};

export default class ApiWrapper extends React.PureComponent<Props, State> {
  state: State = {} as State;

  constructor (props: Props) {
    super(props);

    const { provider, url = '' } = props;
    const api = props.api || new RxApi(
      url && url.length
        ? new WsProvider(url)
        : provider
    );
    const setApi = (api: RpcRxInterface): void => {
      const apiObservable = new Api(api);

      this.setState({ api, apiObservable }, () => {
        this.updateSubscriptions();
      });
    };
    const setApiProvider = (provider?: ProviderInterface): void =>
      setApi(new RxApi(provider));
    const setApiWsUrl = (url: string = defaults.WS_URL): void =>
      setApiProvider(new WsProvider(url));

    this.state = {
      api,
      apiConnected: false,
      apiMethods: {},
      apiObservable: new Api(api),
      apiSupport: 'latest',
      setApi,
      setApiProvider,
      setApiWsUrl,
      subscriptions: []
    };
  }

  componentDidMount () {
    this.updateSubscriptions();
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  private updateSubscriptions () {
    const { api } = this.state;

    this.unsubscribe();
    this.setState({
      subscriptions:
        [
          this.subscribeIsConnected,
          this.subscribeMethodCheck
        ].map((fn: Function) => {
          try {
            return fn(api);
          } catch (error) {
            console.error(error);
            return null;
          }
        })
    });
  }

  private subscribeIsConnected = (api: RpcRxInterface): void => {
    api
      .isConnected()
      .subscribe((isConnected?: boolean) => {
        this.setState({ apiConnected: !!isConnected });
      });
  }

  private subscribeMethodCheck = (api: RpcRxInterface): void => {
    api.chain
      .newHead()
      .subscribe(async (header?: Header) => {
        if (!header || !header.parentHash) {
          return;
        }

        // NOTE no checks atm, add when new method checks are required
      });
  }

  private unsubscribe (): void {
    const { subscriptions } = this.state;

    subscriptions.forEach((subscription) => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  render () {
    const { api, apiConnected, apiMethods, apiObservable, apiSupport, setApi, setApiProvider, setApiWsUrl } = this.state;

    return (
      <ApiContext.Provider value={{
        api,
        apiConnected,
        apiMethods,
        apiObservable,
        apiSupport,
        setApi,
        setApiProvider,
        setApiWsUrl
      }}>
        {this.props.children}
      </ApiContext.Provider>
    );
  }
}
