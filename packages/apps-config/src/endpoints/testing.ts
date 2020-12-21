// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

import { createRococo } from './testingRococo';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

export function createTesting (t: TFunction): LinkOption[] {
  return [
    {
      info: 'dock-testnet',
      text: t('rpc.dock-testnet', 'Dock Testnet', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Dock Association' } }),
      value: 'wss://danforth-1.dock.io'
    }
  ];
}
