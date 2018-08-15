// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/api-provider/types';
import { RxApiInterface } from '@polkadot/api-rx/types';
import { EncodingVersions } from '@polkadot/params/types';
import { Header } from '@polkadot/primitives/header';
import { ApiProps } from '../types';

import React from 'react';

import shouldUseLatestChain from '@polkadot/ui-react-rx/util/shouldUseLatestChain';
import WsProvider from '@polkadot/api-provider/ws';
import createApi from '@polkadot/api-rx';
import defaults from '@polkadot/api-rx/defaults';

import ApiObservable from '../ApiObservable';
import ApiContext from './Context';
import isUndefined from '@polkadot/util/is/undefined';

type Props = {
  api?: RxApiInterface,
  children: any, // node?
  provider?: ProviderInterface,
  url?: string
};

type State = ApiProps & {
  subscriptions: Array<any> // rxjs$ISubscription | null>;
};

function apiSupport (chain?: string): EncodingVersions {
  return shouldUseLatestChain(chain) ? 'latest' : 'poc-1';
}

export default class Api extends React.PureComponent<Props, State> {
  state: State = {} as State;

  constructor (props: Props) {
    super(props);

    const { provider, url = '' } = props;
    const api = props.api || createApi(
      url && url.length
        ? new WsProvider(url)
        : provider
    );
    const setApi = (api: RxApiInterface): void => {
      const apiObservable = new ApiObservable(api);

      this.setState({ api, apiObservable }, () => {
        this.updateSubscriptions();
      });
    };
    const setApiProvider = (provider?: ProviderInterface): void =>
      setApi(createApi(provider));
    const setApiWsUrl = (url: string = defaults.WS_URL): void =>
      setApiProvider(new WsProvider(url));

    this.state = {
      api,
      apiConnected: false,
      apiMethods: {},
      apiObservable: new ApiObservable(api),
      apiSupport: 'poc-1',
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
          this.subscribeChain,
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

  private subscribeIsConnected = (api: RxApiInterface): void => {
    api
      .isConnected()
      .subscribe((isConnected?: boolean) => {
        this.setState({ apiConnected: !!isConnected });
      });
  }

  private subscribeChain = (api: RxApiInterface): void => {
    api.system
      .chain()
      .subscribe((chain?: string) => {
        this.setState({ apiSupport: apiSupport(chain) });
      });
  }

  private subscribeMethodCheck = (api: RxApiInterface): void => {
    api.chain
      .newHead()
      .subscribe(async (header?: Header) => {
        if (!header || !isUndefined(this.state.apiMethods['chain_getBlock'])) {
          return;
        }

        let isSupported = false;

        try {
          await api.chain.getBlock(header.parentHash).toPromise();
          isSupported = true;
        } catch (error) {
          // console.error('chain_getBlock not supported, ignoring');
        }

        this.setState(({ apiMethods }: State) => ({
          apiMethods: {
            ...apiMethods,
            'chain_getBlock': isSupported
          }
        }));
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
