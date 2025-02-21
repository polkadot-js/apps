// Copyright 2017-2024 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-bridge';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: ["tx.xAssetsBridge.depositGovTokenToEvm"]
    },
    group: 'accounts',
    icon: 'address-card',
    name: 'bridge',
    text: t('Transfer(EVM ↔ WASM)', 'Transfer(EVM ↔ WASM)', { ns: 'apps-routing' })
  };
}
