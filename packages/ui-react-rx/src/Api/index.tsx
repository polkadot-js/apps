// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { RpcRxInterface } from '@polkadot/rpc-rx/types';
import { ApiProps } from '../types';

import React from 'react';
import { combineLatest, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import ApiObservable from '@polkadot/api-observable';
import ApiPromise from '@polkadot/api/promise';
import defaults from '@polkadot/rpc-provider/defaults';
import WsProvider from '@polkadot/rpc-provider/ws';
import RxRpc from '@polkadot/rpc-rx';
import keyring from '@polkadot/ui-keyring';
import { isTestChain } from '@polkadot/ui-react-rx/util/index';
import settings from '@polkadot/ui-settings';
import { Method, ChainProperties } from '@polkadot/types';

import { balanceFormat } from '../util/index';
import ApiContext from './Context';
import { InputNumber } from '@polkadot/ui-app/InputNumber';

type Props = {
  children: React.ReactNode,
  url?: string
};

type State = ApiProps & {
  chain?: string,
  rpc: RpcRxInterface,
  subscriptions: Array<any>
};

// HACK Initialise with static data
Method.injectMethods(ApiObservable.extrinsics);

export default class ApiWrapper extends React.PureComponent<Props, State> {
  state: State = {} as State;

  constructor (props: Props) {
    super(props);

    const { url } = props;
    const provider = new WsProvider(url);
    const rpc = new RxRpc(provider);
    const setApi = (provider: ProviderInterface): void => {
      const rpc = new RxRpc(provider);
      const apiObservable = new ApiObservable(rpc);
      const apiPromise = new ApiPromise(provider);

      this.setState({ apiObservable, apiPromise }, () => {
        this.updateSubscriptions();
      });
    };
    const setApiUrl = (url: string = defaults.WS_URL): void =>
      setApi(new WsProvider(url));

    this.state = {
      isApiConnected: false,
      isApiReady: false,
      apiObservable: new ApiObservable(rpc),
      apiPromise: new ApiPromise(provider),
      rpc,
      setApiUrl,
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
    const { apiObservable, rpc } = this.state;

    this.unsubscribe();
    this.setState({
      subscriptions:
        [
          this.subscribeIsConnected,
          this.subscribeIsReady,
          this.subscribeChain
        ].map((fn: Function) => {
          try {
            return fn(rpc, apiObservable);
          } catch (error) {
            console.error(error);
            return null;
          }
        })
    });
  }

  private subscribeChain = (rpc: RpcRxInterface, api: ApiObservable): void => {
    combineLatest(
      rpc.system.properties().pipe(catchError(() => of())),
      api.chain()
    ).subscribe(([properties = new ChainProperties(), value]: [ChainProperties, any]) => {
      const chain = value
        ? value.toString()
        : null;
      const found = settings.availableChains.find(({ name }) => name === chain) || {
        networkId: 0,
        tokenDecimals: 0,
        tokenSymbol: undefined
      };

      console.log('found chain', chain, [...properties.entries()]);

      balanceFormat.setDefaultDecimals(properties.get('tokenDecimals') || found.tokenDecimals);
      InputNumber.setUnit(properties.get('tokenSymbol') || found.tokenSymbol);

      // setup keyringonly after prefix has been set
      keyring.setAddressPrefix(properties.get('networkId') || found.networkId as any);
      keyring.setDevMode(isTestChain(chain || ''));
      keyring.loadAll();

      this.setState({ chain });
    });
  }

  private subscribeIsConnected = (rpc: RpcRxInterface, api: ApiObservable): void => {
    rpc.isConnected().subscribe((isConnected?: boolean) => {
      this.setState({ isApiConnected: !!isConnected });
    });
  }

  private subscribeIsReady = (rpc: RpcRxInterface, api: ApiObservable): void => {
    api.whenReady.subscribe((isReady?: boolean) => {
      this.setState({ isApiReady: !!isReady });
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
    const { isApiConnected, isApiReady, apiObservable, apiPromise, chain, setApiUrl } = this.state;

    return (
      <ApiContext.Provider
        value={{
          isApiConnected,
          isApiReady: isApiReady && !!chain,
          apiObservable,
          apiPromise,
          setApiUrl
        }}
      >
        {this.props.children}
      </ApiContext.Provider>
    );
  }
}
