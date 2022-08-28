// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ScProvider } from '@polkadot/api';

import { specs as kusama } from './kusama';

export const lightSpecs: Record<string, Record<string, string>> =
  Object
    .entries({ kusama })
    .reduce((all: Record<string, Record<string, string>>, [r, v]) => {
      all[r] = v.reduce((specs: Record<string, string>, k) => {
        specs[k] = `./light/${r}/${k}.json`;

        return specs;
      }, {});

      return all;
    }, {});

export const relaySpecs: Record<string, string> = {
  kusama: ScProvider.WellKnownChain.ksmcc3,
  polkadot: ScProvider.WellKnownChain.polkadot,
  rococo: ScProvider.WellKnownChain.rococo_v2_2,
  westend: ScProvider.WellKnownChain.westend2
};
