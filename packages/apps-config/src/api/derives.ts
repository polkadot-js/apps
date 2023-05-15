// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition, OverrideBundleType } from '@polkadot/types/types';

import equilibrium from './spec/equilibrium.js';
import genshiro from './spec/genshiro.js';
import interbtc from './spec/interbtc.js';
import mangata from './spec/mangata.js';
import subspace from './spec/subspace.js';

const mapping: [OverrideBundleDefinition, string[]][] = [
  [equilibrium, ['Equilibrium', 'Equilibrium-parachain']],
  [genshiro, ['Genshiro', 'Gens-parachain']],
  [interbtc, ['interbtc-parachain', 'interbtc-standalone', 'interlay-parachain', 'kintsugi-parachain', 'testnet-kintsugi', 'testnet-interlay']],
  [subspace, ['subspace']],
  [mangata, ['mangata', 'mangata-parachain']]
];

export function applyDerives (typesBundle: OverrideBundleType): OverrideBundleType {
  mapping.forEach(([{ derives }, chains]): void => {
    chains.forEach((chain): void => {
      if (typesBundle.spec && typesBundle.spec[chain]) {
        typesBundle.spec[chain].derives = derives;
      }
    });
  });

  return typesBundle;
}
