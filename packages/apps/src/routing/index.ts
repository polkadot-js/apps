// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routing, Routes } from '../types';

import accounts from './accounts';
import addresses from './addresses';
import explorer from './explorer';
import extrinsics from './extrinsics';
// import home from './home';
import rpc from './rpc';
// import settings from './settings';
import storage from './storage';
import toolbox from './toolbox';
import unknown from './unknown';
import vanitygen from './vanitygen';

export default ({
  default: 'explorer',
  routes: ([] as Routes).concat(
    explorer, extrinsics, storage, null, accounts, addresses, vanitygen, null, rpc, toolbox
  ),
  unknown
} as Routing);
