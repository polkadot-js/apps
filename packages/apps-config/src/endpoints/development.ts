// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

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

export function createOwn (t: TFunction): LinkOption[] {
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

export function createDev (t: TFunction): LinkOption[] {
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
