// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExternalDef } from './types.js';

import { Commonwealth } from './commonwealth.js';
import { Dotreasury } from './dotreasury.js';
import { KodaDot } from './kodadot.js';
import { Polkaholic } from './polkaholic.js';
import { Polkascan } from './polkascan.js';
import { PolkassemblyIo, PolkassemblyNetwork } from './polkassembly.js';
import { Singular } from './singular.js';
import { Statescan } from './statescan.js';
import { SubId } from './subid.js';
import { Subscan } from './subscan.js';
import { Subsquare } from './subsquare.js';

export const externalLinks: Record<string, ExternalDef> = {
  Commonwealth,
  Dotreasury,
  KodaDot,
  Polkaholic,
  Polkascan,
  PolkassemblyIo,
  PolkassemblyNetwork,
  'Singular (NFTs)': Singular,
  Statescan,
  SubId,
  Subscan,
  Subsquare
};
