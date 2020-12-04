// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import type { LinkOption } from './types';
import { CUSTOM_ENDPOINT_KEY } from './constants';

interface EnvWindow {
  // eslint-disable-next-line camelcase
  process_env?: {
    WS_URL: string;
  }
}

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

function createOwn (t: TFunction): LinkOption[] {
  try {
    const storedItems = localStorage.getItem(CUSTOM_ENDPOINT_KEY);

    if (storedItems) {
      const items = JSON.parse(storedItems) as string[];

      return items.map((textBy) => ({
        info: 'local',
        text: t('rpc.custom.entry', 'Custom', { ns: 'apps-config' }),
        textBy,
        value: textBy
      }));
    }
  } catch (e) {
    console.error(e);
  }

  return [];
}

function createDev (t: TFunction): LinkOption[] {
  return [
    {
      dnslink: 'local',
      info: 'local',
      text: t('rpc.local', 'Local Node', { ns: 'apps-config' }),
      textBy: '127.0.0.1:9944',
      value: 'ws://127.0.0.1:9944'
    }
  ];
}

function createLiveNetworks (t: TFunction): LinkOption[] {
  return [
    {
      dnslink: 'dock-main',
      info: 'dock-mainnet',
      text: t<string>('rpc.dock.io', 'Dock (Mainnet)', { ns: 'apps-config' }),
      value: 'wss://mainnet-node.dock.io',
    },
  ];
}

function createTestNetworks (t: TFunction): LinkOption[] {
  return [
    {
      dnslink: 'dock-test',
      info: 'dock-testnet',
      text: t<string>('rpc.dock.io', 'Dock (Danforth Testnet)', { ns: 'apps-config' }),
      value: 'wss://danforth-1.dock.io',
    },
  ];
}

function createCustom (t: TFunction): LinkOption[] {
  const WS_URL = (
    (typeof process !== 'undefined' ? process.env?.WS_URL : undefined) ||
    (typeof window !== 'undefined' ? (window as EnvWindow).process_env?.WS_URL : undefined)
  );

  return WS_URL
    ? [
      {
        isHeader: true,
        text: t('rpc.custom', 'Custom environment', { ns: 'apps-config' }),
        textBy: '',
        value: ''
      },
      {
        info: 'WS_URL',
        text: t('rpc.custom.entry', 'Custom {{WS_URL}}', { ns: 'apps-config', replace: { WS_URL } }),
        textBy: WS_URL,
        value: WS_URL
      }
    ]
    : [];
}

export function createWsEndpoints (t: TFunction): LinkOption[] {
  return [
    ...createCustom(t),
    {
      isHeader: true,
      text: t('rpc.header.live', 'Live networks', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createLiveNetworks(t),
    {
      isHeader: true,
      text: t('rpc.header.test', 'Test networks', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createTestNetworks(t),
    {
      isDevelopment: true,
      isHeader: true,
      text: t('rpc.header.dev', 'Development', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createDev(t),
    ...createOwn(t)
  ].filter(({ isDisabled }) => !isDisabled);
}
