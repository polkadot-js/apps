// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DOCK_GENESIS, KUSAMA_GENESIS, POLKADOT_GENESIS, POLYMESH_GENESIS } from '../api/constants';

// mapping of the genesisHash with the actual app name for Ledger
// (these need to match with the network key in @polkadot/networks)
export const ledgerChains = [
  [DOCK_GENESIS, 'dock'],
  [KUSAMA_GENESIS, 'kusama'],
  [POLKADOT_GENESIS, 'polkadot'],
  [POLYMESH_GENESIS, 'polymath']
];
