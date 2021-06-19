// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import queryString from 'query-string';
import store from 'store';

import { createWsEndpoints } from '@polkadot/apps-config';
import { extractIpfsDetails } from '@polkadot/react-hooks/useIpfs';
import { settings } from '@polkadot/ui-settings';
import { Endpoint, EndpointType } from '@polkadot/ui-settings/types';
import { assert } from '@polkadot/util';

function networkOrUrl (apiType: Endpoint): void {
  if (apiType.type === 'json-rpc' as EndpointType) {
    console.log('WS endpoint=', apiType.param);
  } else if (apiType.type === 'substrate-connect' as EndpointType) {
    console.log('Chain of light client is =', apiType.param);
  }
}

function getApiType (): Endpoint {
  // we split here so that both these forms are allowed
  //  - http://localhost:3000/?rpc=wss://substrate-rpc.parity.io/#/explorer
  //  - http://localhost:3000/#/explorer?rpc=wss://substrate-rpc.parity.io
  const urlOptions = queryString.parse(location.href.split('?')[1]);

  // if specified, this takes priority
  if (urlOptions.rpc) {
    assert(!Array.isArray(urlOptions.rpc), 'Invalid WS endpoint specified');

    // https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9944#/explorer;
    const url = decodeURIComponent(urlOptions.rpc.split('#')[0]);

    assert(url.startsWith('ws://') || url.startsWith('wss://'), 'Non-prefixed ws/wss url');

    return { param: url, type: 'json-rpc' as EndpointType };
  } else if (urlOptions.sc) {
    assert(!Array.isArray(urlOptions.sc), 'Invalid network specified');

    // https://polkadot.js.org/apps/?sc=kusama#/explorer;
    const network = decodeURIComponent(urlOptions.sc.split('#')[0]);
    const chain = network.split('-')[0];

    return { param: chain, type: 'substrate-connect' as EndpointType };
  }

  const endpoints = createWsEndpoints(<T = string>(): T => ('' as unknown as T));
  const { ipnsChain } = extractIpfsDetails();

  // check against ipns domains (could be expanded to others)
  if (ipnsChain) {
    const option = endpoints.find(({ dnslink }) => dnslink === ipnsChain);

    if (option) {
<<<<<<< HEAD
      return { param: option.value as string, type: 'json-rpc' as EndpointType };
=======
      return option.value;
>>>>>>> 9e22ba0f6c5da47f93d0cab38ec097ad7483753c
    }
  }

  const stored = store.get('settings') as Record<string, unknown> || {};
  const fallbackUrl = endpoints.find(({ value }) => !!value);

  // via settings, or the default chain
  return [stored.apiType, process.env.WS_URL].includes(settings.apiType)
    ? settings.apiType // keep as-is
    : fallbackUrl
<<<<<<< HEAD
      ? { param: fallbackUrl.value as string, type: 'json-rpc' as EndpointType } // grab the fallback
      : { param: 'ws://127.0.0.1:9944', type: 'json-rpc' as EndpointType }; // nothing found, go local
=======
      ? fallbackUrl.value // grab the fallback
      : 'ws://127.0.0.1:9944'; // nothing found, go local
>>>>>>> 9e22ba0f6c5da47f93d0cab38ec097ad7483753c
}

// There cannot be a Substrate Connect light client default (expect only jrpc EndpointType)
const apiType = getApiType();

// set the default as retrieved here
settings.set({ apiType });

networkOrUrl(apiType);
