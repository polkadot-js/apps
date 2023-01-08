// Copyright 2017-2023 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import type { ProviderStats } from '@polkadot/rpc-provider/types';
import type { ChainProperties, ChainType } from '@polkadot/types/interfaces';
import type { KeyringStore } from '@polkadot/ui-keyring/types';
import type { ApiProps, ApiState } from './types';

import * as Sc from '@substrate/connect';
import React, { useEffect, useMemo, useState } from 'react';
import store from 'store';

import { ApiPromise, ScProvider, WsProvider } from '@polkadot/api';
import { deriveMapCache, setDeriveCache } from '@polkadot/api-derive/util';
import { ethereumChains, typesBundle } from '@polkadot/apps-config';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { TokenUnit } from '@polkadot/react-components/InputNumber';
import { useApiUrl, useEndpoint, useQueue } from '@polkadot/react-hooks';
import ApiSigner from '@polkadot/react-signer/signers/ApiSigner';
import { keyring } from '@polkadot/ui-keyring';
import { settings } from '@polkadot/ui-settings';
import { formatBalance, isNumber, isTestChain, objectSpread, stringify } from '@polkadot/util';
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults';

import { lightSpecs, relaySpecs } from './light';
import registry from './typeRegistry';
import { decodeUrlTypes } from './urlTypes';

interface Props {
  children: React.ReactNode;
  apiUrl: string;
  isElectron: boolean;
  store?: KeyringStore;
}

interface InjectedAccountExt {
  address: string;
  meta: {
    name: string;
    source: string;
    whenCreated: number;
  };
}

interface ChainData {
  injectedAccounts: InjectedAccountExt[];
  properties: ChainProperties;
  systemChain: string;
  systemChainType: ChainType;
  systemName: string;
  systemVersion: string;
}

export const DEFAULT_DECIMALS = registry.createType('u32', 12);
export const DEFAULT_SS58 = registry.createType('u32', addressDefaults.prefix);
export const DEFAULT_AUX = ['Aux1', 'Aux2', 'Aux3', 'Aux4', 'Aux5', 'Aux6', 'Aux7', 'Aux8', 'Aux9'];

export const ApiContext: React.Context<ApiProps> = React.createContext({} as unknown as ApiProps);

const DISALLOW_EXTENSIONS: string[] = [];

let api: ApiPromise;

export { api };

function isKeyringLoaded () {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

function getDevTypes (): Record<string, Record<string, string>> {
  const types = decodeUrlTypes() || store.get('types', {}) as Record<string, Record<string, string>>;
  const names = Object.keys(types);

  names.length && console.log('Injected types:', names.join(', '));

  return types;
}

async function getInjectedAccounts (injectedPromise: Promise<InjectedExtension[]>): Promise<InjectedAccountExt[]> {
  try {
    await injectedPromise;

    const accounts = await web3Accounts();

    return accounts.map(({ address, meta }, whenCreated): InjectedAccountExt => ({
      address,
      meta: objectSpread({}, meta, {
        name: `${meta.name || 'unknown'} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`,
        whenCreated
      })
    }));
  } catch (error) {
    console.error('web3Accounts', error);

    return [];
  }
}

function makeCreateLink (baseApiUrl: string, isElectron: boolean): (path: string) => string {
  return (path: string, apiUrl?: string): string =>
    `${isElectron
      ? 'https://polkadot.js.org/apps/'
      : `${window.location.origin}${window.location.pathname}`
    }?rpc=${encodeURIComponent(apiUrl || baseApiUrl)}#${path}`;
}

function getStats (...apis: ApiPromise[]): { stats: ProviderStats, when: number } {
  const stats: ProviderStats = {
    active: {
      requests: 0,
      subscriptions: 0
    },
    total: {
      bytesRecv: 0,
      bytesSent: 0,
      cached: 0,
      errors: 0,
      requests: 0,
      subscriptions: 0,
      timeout: 0
    }
  };

  for (let i = 0; i < apis.length; i++) {
    if (apis[i]) {
      const s = apis[i].stats;

      if (s) {
        stats.active.requests += s.active.requests;
        stats.active.subscriptions += s.active.subscriptions;
        stats.total.bytesRecv += s.total.bytesRecv;
        stats.total.bytesSent += s.total.bytesSent;
        stats.total.cached += s.total.cached;
        stats.total.errors += s.total.errors;
        stats.total.requests += s.total.requests;
        stats.total.subscriptions += s.total.subscriptions;
        stats.total.timeout += s.total.timeout;
      }
    }
  }

  return {
    stats,
    when: Date.now()
  };
}

async function retrieve (api: ApiPromise, injectedPromise: Promise<InjectedExtension[]>): Promise<ChainData> {
  const [systemChain, systemChainType, systemName, systemVersion, injectedAccounts] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
    api.rpc.system.name(),
    api.rpc.system.version(),
    getInjectedAccounts(injectedPromise)
  ]);

  return {
    injectedAccounts: injectedAccounts.filter(({ meta: { source } }) =>
      !DISALLOW_EXTENSIONS.includes(source)
    ),
    properties: registry.createType('ChainProperties', {
      ss58Format: api.registry.chainSS58,
      tokenDecimals: api.registry.chainDecimals,
      tokenSymbol: api.registry.chainTokens
    }),
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString()
  };
}

async function loadOnReady (api: ApiPromise, endpoint: LinkOption | null, injectedPromise: Promise<InjectedExtension[]>, store: KeyringStore | undefined, types: Record<string, Record<string, string>>): Promise<ApiState> {
  registry.register(types);

  const { injectedAccounts, properties, systemChain, systemChainType, systemName, systemVersion } = await retrieve(api, injectedPromise);
  const chainSS58 = properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber();
  const ss58Format = settings.prefix === -1
    ? chainSS58
    : settings.prefix;
  const tokenSymbol = properties.tokenSymbol.unwrapOr([formatBalance.getDefaults().unit, ...DEFAULT_AUX]);
  const tokenDecimals = properties.tokenDecimals.unwrapOr([DEFAULT_DECIMALS]);
  const isEthereum = ethereumChains.includes(api.runtimeVersion.specName.toString());
  const isDevelopment = (systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain));

  console.log(`chain: ${systemChain} (${systemChainType.toString()}), ${stringify(properties)}`);

  // explicitly override the ss58Format as specified
  registry.setChainProperties(registry.createType('ChainProperties', { ss58Format, tokenDecimals, tokenSymbol }));

  // first setup the UI helpers
  formatBalance.setDefaults({
    decimals: tokenDecimals.map((b) => b.toNumber()),
    unit: tokenSymbol[0].toString()
  });
  TokenUnit.setAbbr(tokenSymbol[0].toString());

  // finally load the keyring
  isKeyringLoaded() || keyring.loadAll({
    genesisHash: api.genesisHash,
    genesisHashAdd: endpoint && isNumber(endpoint.paraId) && (endpoint.paraId < 2000) && endpoint.genesisHashRelay
      ? [endpoint.genesisHashRelay]
      : [],
    isDevelopment,
    ss58Format,
    store,
    type: isEthereum ? 'ethereum' : 'ed25519'
  }, injectedAccounts);

  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];
  const apiDefaultTx = api.tx[defaultSection][defaultMethod];
  const apiDefaultTxSudo = (api.tx.system && api.tx.system.setCode) || apiDefaultTx;

  setDeriveCache(api.genesisHash.toHex(), deriveMapCache);

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    chainSS58,
    hasInjectedAccounts: injectedAccounts.length !== 0,
    isApiReady: true,
    isDevelopment: isEthereum ? false : isDevelopment,
    isEthereum,
    specName: api.runtimeVersion.specName.toString(),
    specVersion: api.runtimeVersion.specVersion.toString(),
    systemChain,
    systemName,
    systemVersion
  };
}

/**
 * @internal
 * Creates a ScProvider from a <relay>[/parachain] string
 */
async function getLightProvider (chain: string): Promise<ScProvider> {
  const [sc, relayName, paraName] = chain.split('/');

  if (sc !== 'substrate-connect') {
    throw new Error(`Cannot connect to non substrate-connect protocol ${chain}`);
  } else if (!relaySpecs[relayName] || (paraName && (!lightSpecs[relayName] || !lightSpecs[relayName][paraName]))) {
    throw new Error(`Unable to construct light chain ${chain}`);
  }

  const relay = new ScProvider(Sc, relaySpecs[relayName]);

  if (!paraName) {
    return relay;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const specMod = await import(`${lightSpecs[relayName][paraName]}`);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return new ScProvider(Sc, JSON.stringify(specMod.default), relay);
}

/**
 * @internal
 */
async function createApi (apiUrl: string, signer: ApiSigner, onError: (error: unknown) => void): Promise<Record<string, Record<string, string>>> {
  const types = getDevTypes();
  const isLight = apiUrl.startsWith('light://');

  try {
    const provider = isLight
      ? await getLightProvider(apiUrl.replace('light://', ''))
      : new WsProvider(apiUrl);

    api = new ApiPromise({
      provider,
      registry,
      signer,
      types,
      typesBundle
    });

    // See https://github.com/polkadot-js/api/pull/4672#issuecomment-1078843960
    if (isLight) {
      await provider.connect();
    }
  } catch (error) {
    onError(error);
  }

  return types;
}

export function ApiCtxRoot ({ apiUrl, children, isElectron, store }: Props): React.ReactElement<Props> | null {
  const { queuePayload, queueSetTxStatus } = useQueue();
  const [state, setState] = useState<ApiState>({ hasInjectedAccounts: false, isApiReady: false } as unknown as ApiState);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [apiError, setApiError] = useState<null | string>(null);
  const [extensions, setExtensions] = useState<InjectedExtension[] | undefined>();
  const apiEndpoint = useEndpoint(apiUrl);
  const relayUrls = useMemo(
    () => (apiEndpoint && apiEndpoint.valueRelay && isNumber(apiEndpoint.paraId) && (apiEndpoint.paraId < 2000))
      ? apiEndpoint.valueRelay
      : null,
    [apiEndpoint]
  );
  const apiRelay = useApiUrl(relayUrls);
  const createLink = useMemo(
    () => makeCreateLink(apiUrl, isElectron),
    [apiUrl, isElectron]
  );
  const value = useMemo<ApiProps>(
    () => objectSpread({}, state, { api, apiEndpoint, apiError, apiRelay, apiUrl, createLink, extensions, getStats, isApiConnected, isApiInitialized, isElectron, isWaitingInjected: !extensions }),
    [apiError, createLink, extensions, isApiConnected, isApiInitialized, isElectron, state, apiEndpoint, apiRelay, apiUrl]
  );

  // initial initialization
  useEffect((): void => {
    const onError = (error: unknown): void => {
      console.error(error);

      setApiError((error as Error).message);
    };

    createApi(apiUrl, new ApiSigner(registry, queuePayload, queueSetTxStatus), onError)
      .then((types): void => {
        api.on('connected', () => setIsApiConnected(true));
        api.on('disconnected', () => setIsApiConnected(false));
        api.on('error', onError);
        api.on('ready', (): void => {
          const injectedPromise = web3Enable('polkadot-js/apps');

          injectedPromise
            .then(setExtensions)
            .catch(console.error);

          loadOnReady(api, apiEndpoint, injectedPromise, store, types)
            .then(setState)
            .catch(onError);
        });

        setIsApiInitialized(true);
      })
      .catch(onError);
  }, [apiEndpoint, apiUrl, queuePayload, queueSetTxStatus, store]);

  if (!value.isApiInitialized) {
    return null;
  }

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}
