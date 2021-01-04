// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KUSAMA_GENESIS, POLKADOT_GENESIS } from '../api/constants';

// mapping of the genesisHash with the actual app name for Ledger
export const ledgerChains = [
  [KUSAMA_GENESIS, 'kusama'],
  [POLKADOT_GENESIS, 'polkadot']
];
