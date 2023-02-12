// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition, OverrideBundleType } from '@polkadot/types/types';

// import equilibrium from './spec/equilibrium';
// import genshiro from './spec/genshiro';
// import interbtc from './spec/interbtc';
// import subspace from './spec/subspace';

const mapping: [OverrideBundleDefinition, string[]][] = [
  // [equilibrium, ['Equilibrium']],
  // [genshiro, ['Genshiro', 'Genshiro Rococo Testnet']],
  // [interbtc, ['interbtc-parachain', 'interbtc-standalone', 'interlay-parachain', 'kintsugi-parachain']],
  // [subspace, ['subspace']]
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
