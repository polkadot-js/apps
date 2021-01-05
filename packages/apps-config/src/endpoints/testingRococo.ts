// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

// Based on history, this will expand so keep it as a singular chunk
export function createRococo (t: TFunction): LinkOption {
  return {
    dnslink: 'rococo',
    info: 'rococo',
    text: t('rpc.rococo', 'Rococo', { ns: 'apps-config' }),
    textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Parity' } }),
    value: 'wss://rococo-rpc.polkadot.io',
    // eslint-disable-next-line sort-keys
    linked: [
      // these are the base chains
      {
        info: 'rococoTick',
        text: t('rpc.rococo.tick', 'Tick', { ns: 'apps-config' }),
        textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Parity' } }),
        value: 'wss://tick-rpc.polkadot.io'
      },
      {
        info: 'rococoTrick',
        text: t('rpc.rococo.trick', 'Trick', { ns: 'apps-config' }),
        textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Parity' } }),
        value: 'wss://trick-rpc.polkadot.io'
      },
      {
        info: 'rococoTrack',
        text: t('rpc.rococo.track', 'Track', { ns: 'apps-config' }),
        textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Parity' } }),
        value: 'wss://track-rpc.polkadot.io'
      }
      // add any additional parachains here, alphabetical
    ]
  };
}
