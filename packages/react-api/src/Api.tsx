// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types';
import { QueueTxPayloadAdd, QueueTxMessageSetStatus } from '@polkadot/react-components/Status/types';

import React, { useEffect, useState } from 'react';
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

interface ParitalProps {
  apiDefaultTx: SubmittableExtrinsicFunction;
  apiDefaultTxSudo: SubmittableExtrinsicFunction;
  isApiReady: boolean;
  isDevelopment: boolean;
  isSubstrateV2: boolean;
  systemChain: string;
  systemName: string;
  systemVersion: string;
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

async function loadOnReady (): Promise<ParitalProps> {
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
  const systemChain = _systemChain.toString();
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

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    isApiReady: true,
    isDevelopment,
    isSubstrateV2,
    systemChain,
    systemName: _systemName.toString(),
    systemVersion: _systemVersion.toString()
  };
}

export { api };

export default function Api ({ children, queuePayload, queueSetTxStatus, url = defaults.WS_URL }: Props): React.ReactElement<Props> {
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isWaitingInjected, setIsWaitingInjected] = useState(isWeb3Injected);
  const [provided, setProvided] = useState<ParitalProps>({} as ParitalProps);

  useEffect((): void => {
    api = new ApiPromise({
      provider: new WsProvider(url),
      signer: new ApiSigner(queuePayload, queueSetTxStatus),
      typesChain,
      typesSpec
    });

    api.on('connected', (): void => setIsApiConnected(true));
    api.on('disconnected', (): void => setIsApiConnected(false));
    api.on('ready', (): void => {
      loadOnReady()
        .then(setProvided)
        .catch((error): void => console.error('Unable to load chain', error));
    });

    injectedPromise
      .then((): void => setIsWaitingInjected(false))
      .catch((error: Error) => console.error(error));
  }, []);

  return (
    <ApiContext.Provider
      value={{
        ...provided,
        api,
        isApiConnected,
        isWaitingInjected
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
