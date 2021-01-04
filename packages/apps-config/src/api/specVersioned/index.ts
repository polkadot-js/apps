// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import acala from './acala';
import equilibrium from './equilibrium';
import kulupu from './kulupu';
import laminar from './laminar';
import moonbeam from './moonbeam';
import polkabtc from './polkabtc';
import soraSubstrate from './soraSubstrate';

export default {
  Equilibrium: equilibrium,
  acala,
  'btc-parachain': polkabtc,
  kulupu,
  laminar,
  mandala: acala,
  'moonbase-alphanet': moonbeam,
  moonbeam,
  'moonbeam-standalone': moonbeam,
  'node-moonbeam': moonbeam,
  'sora-substrate': soraSubstrate
};
