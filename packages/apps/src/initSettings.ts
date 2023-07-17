// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import queryString from 'query-string';
import store from 'store';

import { createWsEndpoints } from '@polkadot/apps-config';
import { extractIpfsDetails } from '@polkadot/react-hooks/useIpfs';
import { settings } from '@polkadot/ui-settings';
import { assert } from '@polkadot/util';

import config from '../../apps-config/src/variables/config.js';

function networkOrUrl (apiUrl: string, lcUrl: string): void {
  if (apiUrl.startsWith('light://')) {
    console.log('Light endpoint=', apiUrl.replace('light://', ''));
  } else {
    console.log('WS endpoint=', apiUrl);
  }

  console.log('LC endpoint=', lcUrl);
}

function getApiUrl (): string {
  // we split here so that both these forms are allowed
  //  - http://localhost:3000/?rpc=wss://substrate-rpc.parity.io/#/explorer
  //  - http://localhost:3000/#/explorer?rpc=wss://substrate-rpc.parity.io
  const urlOptions = queryString.parse(location.href.split('?')[1]);

  // if specified, this takes priority
  if (urlOptions.rpc) {
    assert(!Array.isArray(urlOptions.rpc), 'Invalid WS endpoint specified');

    // https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9944#/explorer;
    const url = decodeURIComponent(urlOptions.rpc.split('#')[0]);

    assert(url.startsWith('ws://') || url.startsWith('wss://') || url.startsWith('light://'), 'Non-prefixed ws/wss/light url');

    return url;
  }

  const endpoints = createWsEndpoints(<T = string>(): T => ('' as unknown as T));
  const { ipnsChain } = extractIpfsDetails();

  // check against ipns domains (could be expanded to others)
  if (ipnsChain) {
    const option = endpoints.find(({ dnslink }) => dnslink === ipnsChain);

    if (option) {
      return option.value;
    }
  }

  const stored = store.get('settings') as Record<string, unknown> || {};
  const fallbackUrl = endpoints.find(({ value }) => !!value);

  // via settings, or the default chain
  return [stored.apiUrl, process.env.WS_URL].includes(settings.apiUrl)
    ? settings.apiUrl // keep as-is
    : fallbackUrl
      ? fallbackUrl.value // grab the fallback
      : 'ws://127.0.0.1:9944'; // nothing found, go local
}

function getLightClientUrl (): string {
  // we split here so that both these forms are allowed
  //  - http://localhost:3000/?light=https://kate.avail.tools/#/explorer
  //  - http://localhost:3000/#/explorer?light=https://kate.avail.tools/light/v1
  const urlOptions = queryString.parse(location.href.split('?')[1]);

  // if specified, this takes priority
  if (urlOptions.light) {
    assert(!Array.isArray(urlOptions.light), 'Invalid LC endpoint specified');
    const url = decodeURIComponent(urlOptions.light.split('#')[0]);

    assert(url.startsWith('http://') || url.startsWith('https://'), 'Non-prefixed http/https url');

    return url;
  }

  const stored = window.localStorage.getItem('lcUrl');
  const fallUrl = config.LCURL + '/v1';

  console.log('LC fallback=', fallUrl);
  const fallbackUrl = fallUrl;

  // via settings, or the default chain
  return (stored !== null && stored !== undefined)
    ? stored // keep as-is
    : fallbackUrl;
}

// There cannot be a Substrate Connect light client default (expect only jrpc EndpointType)
const apiUrl = getApiUrl();
const lcUrl = getLightClientUrl();

// set the default as retrieved here
settings.set({ apiUrl });
window.localStorage.setItem('lcUrl', lcUrl);

networkOrUrl(apiUrl, lcUrl);
