// Copyright 2017-2020 @canvas-ui/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
