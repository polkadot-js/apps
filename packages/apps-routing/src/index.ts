// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routing, Routes } from './types';

import appSettings from '@polkadot/ui-settings';

import template from './123code';
import accounts from './accounts';
import addressbook from './addressbook';
import claims from './claims';
import contracts from './contracts';
import council from './council';
// import dashboard from './dashboard';
import democracy from './democracy';
import explorer from './explorer';
import extrinsics from './extrinsics';
import genericAsset from './generic-asset';
import js from './js';
import parachains from './parachains';
import settings from './settings';
import staking from './staking';
import storage from './storage';
import sudo from './sudo';
import techcomm from './techcomm';
import toolbox from './toolbox';
import transfer from './transfer';
import treasury from './treasury';

const routes: Routes = appSettings.uiMode === 'light'
  ? ([] as Routes).concat(
    // dashboard,
    explorer,
    accounts,
    addressbook,
    claims,
    transfer,
    genericAsset,
    null,
    staking,
    democracy,
    council,
    // TODO Not sure about the inclusion of treasury & parachains here
    null,
    settings
  )
  : ([] as Routes).concat(
    // dashboard,
    explorer,
    accounts,
    addressbook,
    claims,
    transfer,
    genericAsset,
    null,
    staking,
    democracy,
    council,
    treasury,
    techcomm,
    parachains,
    null,
    contracts,
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
  default: 'explorer',
  routes
};

export default setup;
