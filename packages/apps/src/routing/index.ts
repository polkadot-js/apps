// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routing, Routes } from '../types';

import appSettings from '@polkadot/ui-settings';

import template from './123code';
import accounts from './accounts';
import addresses from './addresses';
import democracy from './democracy';
import explorer from './explorer';
import extrinsics from './extrinsics';
import js from './js';
import settings from './settings';
import staking from './staking';
import storage from './storage';
import toolbox from './toolbox';
import transfer from './transfer';

const routes: Routes = appSettings.uiMode === 'light'
  ? ([] as Routes).concat(
    transfer,
    staking,
    democracy,
    null,
    accounts,
    addresses,
    null,
    settings,
    template
  )
  : ([] as Routes).concat(
    explorer,
    transfer,
    staking,
    democracy,
    null,
    accounts,
    addresses,
    null,
    storage,
    extrinsics,
    null,
    settings,
    toolbox,
    js,
    template
  );

export default ({
  default: appSettings.uiMode === 'light'
    ? 'transfer'
    : 'explorer',
  routes
} as Routing);
