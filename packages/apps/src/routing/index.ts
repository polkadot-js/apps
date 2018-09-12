// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routing, Routes } from '../types';

import accounts from './accounts';
import addresses from './addresses';
import democracy from './democracy';
import example from './example';
import explorer from './explorer';
import extrinsics from './extrinsics';
import rpc from './rpc';
import staking from './staking';
import storage from './storage';
import toolbox from './toolbox';
import transfer from './transfer';
import vanitygen from './vanitygen';

export default ({
  default: 'explorer',
  routes: ([] as Routes).concat(
    example,
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
    vanitygen,
    rpc,
    toolbox
  )
} as Routing);
