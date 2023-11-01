// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable header/header */
import type { TFunction } from '../types.js';
import type { LinkOption } from './types.js';

import { nodesNodleSVG } from '../ui/logos/nodes/generated/nodleSVG.js';
import { expandEndpoints } from './util.js';

/* eslint-disable sort-keys */

export function createNodle (t: TFunction, firstOnly: boolean, withSort: boolean): LinkOption[] {
  return expandEndpoints(t, [
    {
      info: 'nodle',
      text: t('rpc.nodle-eden', 'Mainnet', { ns: 'apps-config' }),
      providers: {
        OnFinality: 'wss://nodle-parachain.api.onfinality.io/public-ws',
        Dwellir: 'wss://eden-rpc.dwellir.com'
      },
      ui: {
        color: '#1ab394',
        logo: nodesNodleSVG
      }
    },
    {
      info: 'nodle',
      text: t('rpc.nodle-paradis', 'Testnet', { ns: 'apps-config' }),
      providers: {
        OnFinality: 'wss://node-6957502816543653888.lh.onfinality.io/ws?apikey=09b04494-3139-4b57-a5d1-e1c4c18748ce'
      },
      ui: {
        color: '#1ab394',
        logo: nodesNodleSVG
      }
    }
  ], firstOnly, withSort);
}
