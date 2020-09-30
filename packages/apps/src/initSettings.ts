// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import queryString from 'query-string';
import store from 'store';
import axios from 'axios';

import { createEndpoints } from '@polkadot/apps-config/settings';
import { extractIpfsDetails } from '@polkadot/react-hooks/useIpfs';
import settings from '@polkadot/ui-settings';
import keyring from '@polkadot/ui-keyring';
import { assert } from '@polkadot/util';

// Pull validator addresses into contacts based on betwork
const validatorAddressUriMap = {
  'wss://danforth-1.dock.io': 'https://gist.githubusercontent.com/lovesh/c540b975774735fe0001c86fa47a91b3/raw',
  'wss://mainnet-node.dock.io': 'https://gist.githubusercontent.com/lovesh/2cc067d1442d71b8beb9ac2443fdd34c/raw'
};

function setDefaultContacts (apiUrl): null {
  const addressUri = validatorAddressUriMap[apiUrl];
  if (addressUri) {
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

    assert(url.startsWith('ws://') || url.startsWith('wss://'), 'Non-prefixed ws/wss url');

    return url;
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
// const defaultContactCount = getDefaultContacts();
setDefaultContacts(apiUrl);

// set the default as retrieved here
settings.set({ apiUrl });

console.log('WS endpoint=', apiUrl);
