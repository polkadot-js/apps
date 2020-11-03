// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routing, Routes } from './types';

import appSettings from '@polkadot/ui-settings';

import template from './123code';
import accounts from './accounts';
import claims from './claims';
import explorer from './explorer';
import extrinsics from './extrinsics';
import genericAsset from './generic-asset';
import js from './js';
import parachains from './parachains';
import settings from './settings';
import society from './society';
import storage from './storage';
import sudo from './sudo';
import toolbox from './toolbox';
import transfer from './transfer';
import landing from './landing';

const routes: Routes = appSettings.uiMode === 'light'
  ? ([] as Routes).concat(
    landing,
    accounts,
    genericAsset,
    explorer,
    claims,
    transfer,
    null,
    // TODO Not sure about the inclusion of treasury, parachains & society here
    null,
    settings
  )
  : ([] as Routes).concat(
    landing,
    accounts,
    genericAsset,
    explorer,
    claims,
    transfer,
    null,
    parachains,
    society,
    null,
    storage,
    extrinsics,
    sudo,
    null,
    settings,
    toolbox,
    js,
    template
  );

const setup: Routing = {
  default: 'landing',
  routes
};

export default setup;
