// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from '../types.js';
import type { LinkOption } from './types.js';

export const CUSTOM_ENDPOINT_KEY = 'polkadot-app-custom-endpoints';

interface EnvWindow {
  // eslint-disable-next-line camelcase
  process_env?: {
    WS_URL: string;
  }
}

export function createCustom (t: TFunction): LinkOption[] {
  const WS_URL = (
    (typeof process !== 'undefined' ? process.env?.WS_URL : undefined) ||
    (typeof window !== 'undefined' ? (window as EnvWindow).process_env?.WS_URL : undefined)
  );

  return WS_URL
    ? [
      {
        isHeader: true,
        text: t('rpc.dev.custom', 'Custom environment', { ns: 'apps-config' }),
        textBy: '',
        ui: {},
        value: ''
      },
      {
        info: 'WS_URL',
        text: t('rpc.dev.custom.entry', 'Custom {{WS_URL}}', { ns: 'apps-config', replace: { WS_URL } }),
        textBy: WS_URL,
        ui: {},
        value: WS_URL
      }
    ]
    : [];
}

export function createOwn (t: TFunction): LinkOption[] {
  try {
    // this may not be available, e.g. when running via script
    const storedItems = typeof localStorage === 'object' && typeof localStorage.getItem === 'function'
      ? localStorage.getItem(CUSTOM_ENDPOINT_KEY)
      : null;

    if (storedItems) {
      const items = JSON.parse(storedItems) as string[];

      return items.map((textBy) => ({
        info: 'local',
        text: t('rpc.dev.custom.own', 'Custom', { ns: 'apps-config' }),
        textBy,
        ui: {},
        value: textBy
      }));
    }
  } catch (e) {
    console.error(e);
  }

  return [];
}

export function createDev (t: TFunction): LinkOption[] {
  return [
    {
      dnslink: 'local',
      info: 'local',
      text: t('rpc.dev.local', 'Local Node', { ns: 'apps-config' }),
      textBy: '127.0.0.1:9944',
      ui: {},
      value: 'ws://127.0.0.1:9944'
    }
  ];
}
