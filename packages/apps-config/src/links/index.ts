// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExternalDef } from './types';

import Commonwealth from './commonwealth';
import DotScanner from './dotscanner';
import Polkascan from './polkascan';
import Polkassembly from './polkassembly';
import Polkastats from './polkastats';
import Subscan from './subscan';

export const externalLinks: Record<string, ExternalDef> = {
  Commonwealth,
  DotScanner,
  Polkascan,
  Polkassembly,
  Polkastats,
  Subscan
};
