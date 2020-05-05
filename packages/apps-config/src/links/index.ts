// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ExternalDef } from './types';

import Commonwealth from './commonwealth';
import Polkascan from './polkascan';
import Polkassembly from './polkassembly';
import Subscan from './subscan';

const externals: Record<string, ExternalDef> = {
  Commonwealth,
  Polkascan,
  Polkassembly,
  Subscan
};

export default externals;
