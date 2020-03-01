// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export default {
  isActive: true,
  chains: {
    Edgeware: 'edgeware',
    Kusama: 'kusama',
    'Kusama CC3': 'kusama'
  },
  paths: {
    council: 'proposal/councilmotion',
    proposal: 'proposal/democracyproposal',
    referendum: 'proposal/referendum',
    treasury: 'proposal/treasuryproposal'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://commonwealth.im/${chain}/${path}/${data.toString()}`
};
