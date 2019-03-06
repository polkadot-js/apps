// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routing, Routes } from '../types';

import appSettings from '@polkadot/joy-settings/index';

import election from './joy-election';
import proposals from './joy-proposals';
import help from './joy-help';

import template from './123code';
import accounts from './accounts';
import addresses from './addresses';
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
    explorer,
    staking,
    transfer,
    null,
    accounts,
    addresses,
    null,
    election,
    proposals,
    null,
    help,
    settings,
    template
  )
  : ([] as Routes).concat(
    explorer,
    staking,
    transfer,
    null,
    accounts,
    addresses,
    null,
    election,
    proposals,
    null,
    storage,
    extrinsics,
    null,
    help,
    settings,
    toolbox,
    js,
    template
  );

export default ({
  default: 'explorer',
  routes
} as Routing);
