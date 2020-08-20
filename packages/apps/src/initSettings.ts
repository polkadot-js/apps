// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import queryString from 'query-string';
import store from 'store';
import axios from 'axios';

import { createEndpoints } from '@polkadot/apps-config/settings';
import { extractIpfsDetails } from '@polkadot/react-hooks/useIpfs';
import settings from '@polkadot/ui-settings';
import keyring from '@polkadot/ui-keyring';

const addressUri = '//gist.githubusercontent.com/lovesh/c540b975774735fe0001c86fa47a91b3/raw/0a1ae15962372095348669995d58a2bd0c0bc737/validator%2520names';

function getDefaultContacts (): null {
  axios.get(addressUri)
    .then(function (response): null {
      const hardcodedAddresses = response.data;
      for (let address in hardcodedAddresses) {
        const name = hardcodedAddresses[address];
        console.log('saving address', address, name.trim())
        keyring.saveAddress(address, { genesisHash: keyring.genesisHash, name: name.trim(), tags: [] });
      }
    });
}

function getApiUrl (): string {
  // we split here so that both these forms are allowed
  //  - http://localhost:3000/?rpc=wss://substrate-rpc.parity.io/#/explorer
  //  - http://localhost:3000/#/explorer?rpc=wss://substrate-rpc.parity.io
  const urlOptions = queryString.parse(location.href.split('?')[1]);

  // if specified, this takes priority
  if (urlOptions.rpc) {
    if (Array.isArray(urlOptions.rpc)) {
      throw new Error('Invalid WS endpoint specified');
    }

    return urlOptions.rpc.split('#')[0]; // https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9944#/explorer;
  }

  const endpoints = createEndpoints(<T = string>(): T => ('' as unknown as T));
  const { ipnsChain } = extractIpfsDetails();

  // check against ipns domains (could be expanded to others)
  if (ipnsChain) {
    const option = endpoints.find(({ dnslink }) => dnslink === ipnsChain);

    if (option) {
      return option.value as string;
    }
  }

  const stored = store.get('settings') as Record<string, unknown> || {};
  const fallbackUrl = endpoints.find(({ value }) => !!value);

  // via settings, or the default chain
  return [stored.apiUrl, process.env.WS_URL].includes(settings.apiUrl)
    ? settings.apiUrl // keep as-is
    : fallbackUrl
      ? fallbackUrl.value as string // grab the fallback
      : 'ws://127.0.0.1:9944'; // nothing found, go local
}

const apiUrl = getApiUrl();
const defaultContactCount = getDefaultContacts();

// set the default as retrieved here
settings.set({ apiUrl });

console.log('WS endpoint=', apiUrl);
