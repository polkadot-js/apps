// Copyright 2017-2021 @polkadot/app-config authors & contributors
// and @canvas-ui/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Commonwealth from './commonwealth';
import Polkascan from './polkascan';
import Polkassembly from './polkassembly';
import Subscan from './subscan';
import { ExternalDef } from './types';

const externals: Record<string, ExternalDef> = {
  Commonwealth,
  Polkascan,
  Polkassembly,
  Subscan
};

export default externals;
