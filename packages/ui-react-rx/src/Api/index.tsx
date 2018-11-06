// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { RpcRxInterface } from '@polkadot/rpc-rx/types';
import { ApiProps } from '../types';

import React from 'react';
import Api from '@polkadot/api-observable';
import { setAddressPrefix } from '@polkadot/keyring';
import defaults from '@polkadot/rpc-provider/defaults';
import WsProvider from '@polkadot/rpc-provider/ws';
import RxApi from '@polkadot/rpc-rx';
import settings from '@polkadot/ui-app/settings';
import keyring from '@polkadot/ui-keyring/index';
import { isTestChain } from '@polkadot/ui-react-rx/util/index';
import { Header, Method } from '@polkadot/types';

import { balanceFormat } from '../util/index';
import ApiContext from './Context';
import { InputNumber } from '@polkadot/ui-app/InputNumber';

type Props = {
  api?: RpcRxInterface,
  children: any, // node?
  provider?: ProviderInterface,
  url?: string
};

type State = ApiProps & {
  chain?: string,
  subscriptions: Array<any> // rxjs$ISubscription | null>;
};

// HACK Initialise with static data
Method.injectExtrinsics(Api.extrinsics);

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
      isApiConnected: false,
      isApiReady: false,
      api,
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
    const { api, apiObservable } = this.state;

    this.unsubscribe();
    this.setState({
      subscriptions:
        [
          this.subscribeIsConnected,
          this.subscribeIsReady,
          this.subscribeChain,
          this.subscribeMethodCheck
        ].map((fn: Function) => {
          try {
            return fn(api, apiObservable);
          } catch (error) {
            console.error(error);
            return null;
          }
        })
    });
  }

  private subscribeChain = (rpc: RpcRxInterface, api: Api): void => {
    api.chain().subscribe((value: any) => {
      const chain = value
        ? value.toString()
        : null;
      const found = settings.availableChains.find(({ name }) => name === chain) || { chainId: 0, decimals: 0, unit: undefined };

      console.log('found chain', chain);

      balanceFormat.setDefaultDecimals(found.decimals);
      InputNumber.setUnit(found.unit);
      setAddressPrefix(found.chainId as any);

      // setup keyringonly after prefix has been set
      keyring.setDevMode(isTestChain(chain || ''));
      keyring.loadAll();

      this.setState({ chain });
    });
  }

  private subscribeIsConnected = (rpc: RpcRxInterface, api: Api): void => {
    rpc.isConnected().subscribe((isConnected?: boolean) => {
      this.setState({ isApiConnected: !!isConnected });
    });
  }

  private subscribeIsReady = (rpc: RpcRxInterface, api: Api): void => {
    api.whenReady.subscribe((isReady?: boolean) => {
      this.setState({ isApiReady: !!isReady });
    });
  }

  private subscribeMethodCheck = (rpc: RpcRxInterface, api: Api): void => {
    rpc.chain
      .subscribeNewHead()
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
    const { isApiConnected, isApiReady, api, apiMethods, apiObservable, apiSupport, chain, setApi, setApiProvider, setApiWsUrl } = this.state;

    return (
      <ApiContext.Provider value={{
        isApiConnected,
        isApiReady: isApiReady && !!chain,
        api,
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
