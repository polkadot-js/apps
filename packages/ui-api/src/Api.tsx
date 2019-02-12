// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { QueueTx$ExtrinsicAdd, QueueTx$MessageSetStatus } from '@polkadot/ui-app/Status/types';
import { ApiProps } from './types';

import React from 'react';
import ApiPromise from '@polkadot/api/promise';
import defaults from '@polkadot/rpc-provider/defaults';
import { WsProvider } from '@polkadot/rpc-provider';
import { InputNumber } from '@polkadot/ui-app/InputNumber';
import { formatBalance } from '@polkadot/ui-app/util';
import keyring from '@polkadot/ui-keyring';
import settings from '@polkadot/ui-settings';
import ApiSigner from '@polkadot/ui-signer/ApiSigner';
import { ChainProperties } from '@polkadot/types';

import ApiContext from './ApiContext';
import { isTestChain } from './util';

type Props = {
  children: React.ReactNode,
  queueExtrinsic: QueueTx$ExtrinsicAdd,
  queueSetTxStatus: QueueTx$MessageSetStatus,
  url?: string
};

type State = ApiProps & {
  chain?: string
};

export default class ApiWrapper extends React.PureComponent<Props, State> {
  state: State = {} as State;

  constructor (props: Props) {
    super(props);

    const { queueExtrinsic, queueSetTxStatus, url } = props;
    const provider = new WsProvider(url);
    const signer = new ApiSigner(queueExtrinsic, queueSetTxStatus);

    const setApi = (provider: ProviderInterface): void => {
      const api = new ApiPromise({ provider, signer });

      this.setState({ api }, () => {
        this.updateSubscriptions();
      });
    };
    const setApiUrl = (url: string = defaults.WS_URL): void =>
      setApi(new WsProvider(url));

    this.state = {
      isApiConnected: false,
      isApiReady: false,
      api: new ApiPromise({ provider, signer }),
      setApiUrl
    } as State;
  }

  componentDidMount () {
    this.updateSubscriptions();
  }

  private updateSubscriptions () {
    const { api } = this.state;

    [
      this.subscribeIsConnected,
      this.subscribeIsReady,
      this.subscribeChain
    ].map((fn: Function) => {
      try {
        return fn(api);
      } catch (error) {
        console.error(error);
        return null;
      }
    });
  }

  private subscribeChain = async (api: ApiPromise) => {
    const [properties = new ChainProperties(), value] = await Promise.all([
      api.rpc.system.properties() as Promise<ChainProperties | undefined>,
      api.rpc.system.chain() as Promise<any>
    ]);

    const chain = value
      ? value.toString()
      : null;
    const found = settings.availableChains.find(({ name }) => name === chain) || {
      networkId: 42,
      tokenDecimals: 0,
      tokenSymbol: undefined
    };
    const tokenSymbol = properties.get('tokenSymbol') || found.tokenSymbol;

    console.log('api: found chain', chain, [...properties.entries()]);

    // first setup the UI helpers
    formatBalance.setDefaultDecimals(properties.get('tokenDecimals') || found.tokenDecimals);
    formatBalance.setDefaultUnits(tokenSymbol);
    InputNumber.setUnit(tokenSymbol);

    // setup keyring (loadAll) only after prefix has been set
    keyring.setAddressPrefix(properties.get('networkId') || found.networkId as any || 42);
    keyring.setDevMode(isTestChain(chain || ''));
    keyring.loadAll();

    this.setState({ chain });
  }

  private subscribeIsConnected = (api: ApiPromise) => {
    api.on('connected', () => {
      this.setState({ isApiConnected: true });
    });

    api.on('disconnected', () => {
      this.setState({ isApiConnected: false });
    });
  }

  private subscribeIsReady = (api: ApiPromise) => {
    api.on('ready', () => {
      const section = Object.keys(api.tx)[0];
      const method = Object.keys(api.tx[section])[0];

      this.setState({
        isApiReady: true,
        apiDefaultTx: api.tx[section][method]
      });
    });
  }

  render () {
    const { api, apiDefaultTx, chain, isApiConnected, isApiReady, setApiUrl } = this.state;

    return (
      <ApiContext.Provider
        value={{
          api,
          apiDefaultTx,
          isApiConnected,
          isApiReady: isApiReady && !!chain,
          setApiUrl
        }}
      >
        {this.props.children}
      </ApiContext.Provider>
    );
  }
}
