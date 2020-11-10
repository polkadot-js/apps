// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import acala from './acala';
import laminar from './laminar';
import moonbeam from './moonbeam';

export default {
  acala,
  laminar,
  mandala: acala,
  'moonbase-alphanet': moonbeam,
  'moonbeam-standalone': moonbeam,
  'node-moonbeam': moonbeam,
  moonbeam
};
