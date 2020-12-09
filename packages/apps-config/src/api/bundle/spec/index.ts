// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import acala from './acala';
import equilibrium from './equilibrium';
import laminar from './laminar';
import moonbeam from './moonbeam';
import soraSubstrate from './soraSubstrate';

export default {
  Equilibrium: equilibrium,
  acala,
  laminar,
  mandala: acala,
  'moonbase-alphanet': moonbeam,
  moonbeam,
  'moonbeam-standalone': moonbeam,
  'node-moonbeam': moonbeam,
  'sora-substrate': soraSubstrate
};
