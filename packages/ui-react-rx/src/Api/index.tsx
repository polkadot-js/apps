// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/api-provider/types';
import { RxApiInterface } from '@polkadot/api-rx/types';
import { Header } from '@polkadot/primitives/header';
import { ApiProps } from '../types';

import React from 'react';

import WsProvider from '@polkadot/api-provider/ws';
import RxApi from '@polkadot/api-rx';
import defaults from '@polkadot/api-rx/defaults';
import isUndefined from '@polkadot/util/is/undefined';

import ApiObservable from '../ApiObservable';
import ApiContext from './Context';

type Props = {
  api?: RxApiInterface,
  children: any, // node?
  provider?: ProviderInterface,
  url?: string
};

type State = ApiProps & {
  subscriptions: Array<any> // rxjs$ISubscription | null>;
};

export default class Api extends React.PureComponent<Props, State> {
  state: State = {} as State;

  constructor (props: Props) {
    super(props);

    const { provider, url = '' } = props;
    const api = props.api || new RxApi(
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
      setApi(new RxApi(provider));
    const setApiWsUrl = (url: string = defaults.WS_URL): void =>
      setApiProvider(new WsProvider(url));

    this.state = {
      api,
      apiConnected: false,
      apiMethods: {},
      apiObservable: new ApiObservable(api),
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

  private subscribeIsConnected = (api: RxApiInterface): void => {
    api
      .isConnected()
      .subscribe((isConnected?: boolean) => {
        this.setState({ apiConnected: !!isConnected });
      });
  }

  private subscribeMethodCheck = (api: RxApiInterface): void => {
    api.chain
      .newHead()
      .subscribe(async (header?: Header) => {
        if (!header || !header.parentHash) {
          return;
        }

        try {
          await this.hasChainGetBlock(header.parentHash);
        } catch (error) {
          // swallow
        }
      });
  }

  private async hasChainGetBlock (hash: Uint8Array) {
    const { api, apiMethods: { chain_getBlock } } = this.state;

    if (!isUndefined(chain_getBlock)) {
      return;
    }

    let available = false;

    try {
      available = !!(await api.chain.getBlock(hash).toPromise());
    } catch (error) {
      // swallow
    }

    this.setState(({ apiMethods }) => ({
      apiMethods: {
        ...apiMethods,
        chain_getBlock: available
      }
    }));
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
