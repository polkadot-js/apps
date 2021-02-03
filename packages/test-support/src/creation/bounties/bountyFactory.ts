// Copyright 2017-2020 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { Bounty, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';
import { Registry } from '@polkadot/types/types';

export class BountyFactory {
  readonly #api: ApiPromise;
  readonly #registry: Registry;

  constructor (api: ApiPromise) {
    this.#api = api;
    this.#registry = this.#api.registry;
  }

  public aBountyIndex = (index = 0): BountyIndex =>
    this.#registry.createType('BountyIndex', index);

  public defaultBounty = (): Bounty =>
    this.#registry.createType('Bounty');

  public aBountyStatus = (status: string): BountyStatus =>
    this.#registry.createType('BountyStatus', status);

  public bountyStatusWith = ({ curator = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', status = 'Active', updateDue = 100000 } = {}): BountyStatus => {
    if (status === 'Active') {
      return this.#registry.createType('BountyStatus', { active: { curator, updateDue }, status });
    }

    if (status === 'CuratorProposed') {
      return this.#registry.createType('BountyStatus', { curatorProposed: { curator }, status });
    }

    throw new Error('Unsupported status');
  };

  public bountyWith = ({ status = 'Proposed', value = 1 } = {}): Bounty =>
    this.aBounty({ status: this.aBountyStatus(status), value: balanceOf(value) })

  public aBounty = ({ fee = balanceOf(10), status = this.aBountyStatus('Proposed'), value = balanceOf(500) }: Partial<Bounty> = {}): Bounty =>
    this.#registry.createType('Bounty', { fee, status, value });
}
