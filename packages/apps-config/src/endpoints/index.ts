// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from '../types';
import type { LinkOption } from './types';
// createDev, 
import { defaultT } from '../util';
import { createCustom, devChains, createOwn } from './development';
import { prodChains} from './production';
// import { createKusamaRelay, createPolkadotRelay } from './productionRelays';
import { testChains } from './testing';
// import { createStaging } from './staging';

// import { createRococoRelay, createWestendRelay } from './testingRelays';
// import { createCustom, createDev, createOwn } from './development';
// import { prodChains, prodRelayKusama, prodRelayPolkadot } from './production';
// import { testChains, testRelayRococo, testRelayWestend } from './testing';
import { expandEndpoints } from './util';

export { CUSTOM_ENDPOINT_KEY } from './development';
export * from './production';
export * from './testing';

export function createWsEndpoints (t: TFunction = defaultT, firstOnly = false, withSort = true): LinkOption[] {
  return [
    ...createCustom(t),
    // {
    //   isDisabled: false,
    //   isHeader: true,
    //   isSpaced: true,
    //   text: t('rpc.header.polkadot.relay', 'Polkadot & parachains', { ns: 'apps-config' }),
    //   textBy: '',
    //   value: ''
    // },
    // ...createPolkadotRelay(t, firstOnly, withSort),
    // {
    //   isDisabled: false,
    //   isHeader: true,
    //   text: t('rpc.header.kusama.relay', 'Kusama & parachains', { ns: 'apps-config' }),
    //   textBy: '',
    //   value: ''
    // },
    // ...createKusamaRelay(t, firstOnly, withSort),
    // {
    //   isDisabled: false,
    //   isHeader: true,
    //   isSpaced: true,
    //   text: t('rpc.header.westend.relay', 'Test Westend & parachains', { ns: 'apps-config' }),
    //   textBy: '',
    //   value: ''
    // },
    // ...createWestendRelay(t, firstOnly, withSort),
    // {
    //   isDisabled: false,
    //   isHeader: true,
    //   text: t('rpc.header.rococo.relay', 'Test Rococo & parachains', { ns: 'apps-config' }),
    //   textBy: '',
    //   value: ''
    // },
    // ...createRococoRelay(t, firstOnly, withSort),
    // {
    //   isDisabled: false,
    //   isHeader: true,
    //   text: t('rpc.header.test', 'Stage Networks', { ns: 'apps-config' }),
    //   textBy: '',
    //   value: ''
    // },
    // ...createStaging(t, firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: false,
      text: t('rpc.header.live', 'Live Networks', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...expandEndpoints(t, prodChains, firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      text: t('rpc.header.test', 'Test Networks', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...expandEndpoints(t, testChains, firstOnly, withSort),
    {
      isDevelopment: true,
      isDisabled: false,
      isHeader: true,
      isSpaced: false,
      text: t('rpc.header.dev', 'Development', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
     ...expandEndpoints(t, devChains, firstOnly, withSort),
    ...createOwn(t)
  ].filter(({ isDisabled }) => !isDisabled);
}
