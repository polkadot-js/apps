// Copyright 2017-2025 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WellKnownChain } from '@substrate/connect';

import { specs as kusama } from './kusama/index.js';
import { specs as polkadot } from './polkadot/index.js';

export const lightSpecs: Record<string, Record<string, string>> =
  Object
    .entries({ kusama, polkadot })
    .reduce((all: Record<string, Record<string, string>>, [r, v]) => {
      all[r] = v.reduce((specs: Record<string, string>, k) => {
        specs[k] = `./light/${r}/${k}.json`;

        return specs;
      }, {});

      return all;
    }, {});

export const relaySpecs: Record<string, string> = {
  kusama: WellKnownChain.ksmcc3,
  polkadot: WellKnownChain.polkadot,
  rococo: WellKnownChain.rococo_v2_2,
  westend: WellKnownChain.westend2
};
