// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from './types';

import { expandEndpoints } from './util';

/* eslint-disable sort-keys */

export function createNodle(t: TFunction, firstOnly: boolean, withSort: boolean): LinkOption[] {
  return expandEndpoints(t, [
    {
      info: 'nodle',
      text: t('rpc.nodle-solo', 'Mainnet', { ns: 'apps-config' }),
      providers: {
        Nodle: 'wss://nodle.api.onfinality.io/public-ws'
      }
    },
    {
      info: 'nodle',
      text: t('rpc.nodle-eden', 'Parachain', { ns: 'apps-config' }),
      providers: {
        Nodle: 'wss://nodle-parachain.api.onfinality.io/public-ws',
      }
    },
    {
      info: 'nodle',
      text: t('rpc.nodle-paradis', 'Testnet', { ns: 'apps-config' }),
      providers: {
        Nodle: 'wss://node-6913072722034561024.lh.onfinality.io/ws?apikey=84d77e2e-3793-4785-8908-5096cffea77a'
      }
    }
  ], firstOnly, withSort);
}
