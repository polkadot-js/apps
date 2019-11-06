// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { QueueTxPayloadAdd, QueueTxMessageSetStatus } from '@polkadot/react-components/Status/types';
import { ApiProps } from './types';

import React from 'react';
import ApiPromise from '@polkadot/api/promise';
import { isWeb3Injected, web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import defaults from '@polkadot/rpc-provider/defaults';
import { WsProvider } from '@polkadot/rpc-provider';
import { InputNumber } from '@polkadot/react-components/InputNumber';
import keyring from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import ApiSigner from '@polkadot/react-signer/ApiSigner';
import { u32 as U32 } from '@polkadot/types';
import { formatBalance, isTestChain } from '@polkadot/util';
import addressDefaults from '@polkadot/util-crypto/address/defaults';

import typesChain from './overrides/chain';
import typesSpec from './overrides/spec';
import ApiContext from './ApiContext';

interface Props {
  children: React.ReactNode;
  queuePayload: QueueTxPayloadAdd;
  queueSetTxStatus: QueueTxMessageSetStatus;
  url?: string;
}

interface State extends ApiProps {
  chain?: string | null;
}

interface InjectedAccountExt {
  address: string;
  meta: {
    name: string;
    source: string;
  };
}

const DEFAULT_DECIMALS = new U32(12);
const DEFAULT_SS58 = new U32(addressDefaults.prefix);

const injectedPromise = web3Enable('polkadot-js/apps');
let api: ApiPromise;

export { api };

export default class Api extends React.PureComponent<Props, State> {
  public state: State = {} as unknown as State;

  constructor (props: Props) {
    super(props);

    const { queuePayload, queueSetTxStatus, url } = props;
    const provider = new WsProvider(url);
    const signer = new ApiSigner(queuePayload, queueSetTxStatus);

    const setApi = (provider: ProviderInterface): void => {
      api = this.createApi(provider, signer);

      this.setState({ api }, (): void => {
        this.subscribeEvents();
      });
    };
    const setApiUrl = (url: string = defaults.WS_URL): void =>
      setApi(new WsProvider(url));

    api = this.createApi(provider, signer);

    this.state = {
      api,
      isApiConnected: false,
      isApiReady: false,
      isSubstrateV2: true,
      isWaitingInjected: isWeb3Injected,
      setApiUrl
    } as unknown as State;
  }

  private createApi (provider: ProviderInterface, signer: ApiSigner): ApiPromise {
    return new ApiPromise({
      provider,
      signer,
      typesChain,
      typesSpec
    });
  }

  public componentDidMount (): void {
    this.subscribeEvents();

    injectedPromise
      .then((): void => this.setState({ isWaitingInjected: false }))
      .catch((error: Error) => console.error(error));
  }

  private subscribeEvents (): void {
    const { api } = this.state;

    api.on('connected', (): void => {
      this.setState({ isApiConnected: true });
    });

    api.on('disconnected', (): void => {
      this.setState({ isApiConnected: false });
    });

    api.on('ready', async (): Promise<void> => {
      try {
        await this.loadOnReady(api);
      } catch (error) {
        console.error('Unable to load chain', error);
      }
    });
  }

  private async loadOnReady (api: ApiPromise): Promise<void> {
    const [properties, _systemChain, _systemName, _systemVersion, injectedAccounts] = await Promise.all([
      api.rpc.system.properties(),
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
      web3Accounts().then((accounts): InjectedAccountExt[] =>
        accounts.map(({ address, meta }): InjectedAccountExt => ({
          address,
          meta: {
            ...meta,
            name: `${meta.name} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`
          }
        }))
      )
    ]);
    const ss58Format = uiSettings.prefix === -1
      ? properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber()
      : uiSettings.prefix;
    const tokenSymbol = properties.tokenSymbol.unwrapOr('DEV').toString();
    const tokenDecimals = properties.tokenDecimals.unwrapOr(DEFAULT_DECIMALS).toNumber();
    const systemChain = _systemChain
      ? _systemChain.toString()
      : '<unknown>';
    const isDevelopment = isTestChain(systemChain);

    console.log('api: found chain', systemChain, JSON.stringify(properties));

    // first setup the UI helpers
    formatBalance.setDefaults({
      decimals: tokenDecimals,
      unit: tokenSymbol
    });
    InputNumber.setUnit(tokenSymbol);

    // finally load the keyring
    keyring.loadAll({
      addressPrefix: ss58Format,
      genesisHash: api.genesisHash,
      isDevelopment,
      ss58Format,
      type: 'ed25519'
    }, injectedAccounts);

    const defaultSection = Object.keys(api.tx)[0];
    const defaultMethod = Object.keys(api.tx[defaultSection])[0];
    const apiDefaultTx = api.tx[defaultSection][defaultMethod];
    const apiDefaultTxSudo =
      (api.tx.system && api.tx.system.setCode) || // 2.x
      (api.tx.consensus && api.tx.consensus.setCode) || // 1.x
      apiDefaultTx; // other
    const isSubstrateV2 = !!Object.keys(api.consts).length;

    this.setState({
      apiDefaultTx,
      apiDefaultTxSudo,
      isApiReady: true,
      isDevelopment,
      isSubstrateV2,
      systemChain,
      systemName: _systemName.toString(),
      systemVersion: _systemVersion.toString()
    });
  }

  public render (): React.ReactNode {
    const { api, apiDefaultTx, apiDefaultTxSudo, isApiConnected, isApiReady, isDevelopment, isSubstrateV2, isWaitingInjected, setApiUrl, systemChain, systemName, systemVersion } = this.state;

    return (
      <ApiContext.Provider
        value={{
          api,
          apiDefaultTx,
          apiDefaultTxSudo,
          isApiConnected,
          isApiReady: isApiReady && !!systemChain,
          isDevelopment,
          isSubstrateV2,
          isWaitingInjected,
          setApiUrl,
          systemChain,
          systemName,
          systemVersion
        }}
      >
        {this.props.children}
      </ApiContext.Provider>
    );
  }
}
