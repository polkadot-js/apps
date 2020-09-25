// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ExternalDef } from './types';

import Commonwealth from './commonwealth';
import Polkascan from './polkascan';
import Polkassembly from './polkassembly';
import Polkastats from './polkastats';
import Subscan from './subscan';

const externals: Record<string, ExternalDef> = {
  Commonwealth,
  Polkascan,
  Polkassembly,
  Polkastats,
  Subscan
};

export default externals;
