// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

import { expandEndpoints } from './util';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

// ws addresses in Providers are not real - just a hack to allow "switch" to be activated (needs valid url)
// and the .substrateconnect exists in order to identify that this is a light client provider
// so that we can (in packages/react-api/src/Api.tsx) instead of calling a new WsProvider instead trigger
// a new Detector that will run Substrate-Connect
export function createSubstrateConnect (t: TFunction): LinkOption[] {
  return expandEndpoints(t, [
    {
      dnslink: 'Polkadot (Production)',
      info: 'polkadot',
      text: t('rpc.polkadot.substrateconnect', 'Polkadot (Production)', { ns: 'apps-config' }),
      providers: {
        'your browser': 'ws://polkadot.substrateconnect'
      }
    },
    {
      dnslink: 'Kusama (Production)',
      info: 'kusama',
      text: t('rpc.kusama.substrateconnect', 'Kusama (Production)', { ns: 'apps-config' }),
      providers: {
        'your browser': 'ws://kusama.substrateconnect'
      }
    },
    {
      dnslink: 'Westend (Test)',
      info: 'westend',
      text: t('rpc.westend.substrateconnect', 'Westend (Test)', { ns: 'apps-config' }),
      providers: {
        'your browser': 'ws://westend.substrateconnect'
      }
    }
  ]);
}
