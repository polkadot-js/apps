// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExternalDef } from './types';

import Commonwealth from './commonwealth';
import Dotreasury from './dotreasury';
import DotScanner from './dotscanner';
import Polkascan from './polkascan';
import { PolkassemblyIo, PolkassemblyNetwork } from './polkassembly';
import Polkastats from './polkastats';
import Singular from './singular';
import Statescan from './statescan';
import SubId from './subid';
import Subscan from './subscan';
import Subsquare from './subsquare';

export const externalLinks: Record<string, ExternalDef> = {
  Commonwealth,
  DotScanner,
  Dotreasury,
  Polkascan,
  PolkassemblyIo,
  PolkassemblyNetwork,
  Polkastats,
  'Singular (NFTs)': Singular,
  Statescan,
  SubId,
  Subscan,
  Subsquare
};
