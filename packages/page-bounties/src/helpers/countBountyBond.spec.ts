// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { countBountyBond } from '@polkadot/app-bounties/helpers/countBountyBond';
import { TypeRegistry } from '@polkadot/types/create';

describe('Bounty bond', () => {
  it('Returns proper bond for description "Kusama network UI Bounty"', () => {
    const registry = new TypeRegistry();
    const depositBase = registry.createType('BalanceOf', new BN(166666666666));
    const depositPerByte = registry.createType('BalanceOf', new BN(1666666666));

    expect(countBountyBond('Kusama network UI Bounty', depositBase, depositPerByte)).toEqual(new BN(206666666650));
  });
});
