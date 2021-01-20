// Copyright 2017-2021 @canvas-ui/apps-config authors & contributors
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
