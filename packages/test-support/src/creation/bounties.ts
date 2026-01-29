// Copyright 2017-2025 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BountyIndex } from '@polkadot/types/interfaces';
import type { PalletBountiesBounty, PalletBountiesBountyStatus } from '@polkadot/types/lookup';
import type { Registry } from '@polkadot/types/types';

import { balanceOf } from './balance.js';

export class BountyFactory {
  readonly #api: ApiPromise;
  readonly #registry: Registry;

  constructor (api: ApiPromise) {
    this.#api = api;
    this.#registry = this.#api.registry;
  }

  public aBountyIndex = (index = 0): BountyIndex =>
    this.#registry.createType('BountyIndex', index);

  public defaultBounty = (): PalletBountiesBounty =>
    this.#registry.createType<PalletBountiesBounty>('Bounty');

  public aBountyStatus = (status: string): PalletBountiesBountyStatus =>
    this.#registry.createType('PalletBountiesBountyStatus', status);

  public bountyStatusWith = ({ curator = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', status = 'Active', updateDue = 100000 } = {}): PalletBountiesBountyStatus => {
    if (status === 'Active') {
      return this.#registry.createType('PalletBountiesBountyStatus', { active: { curator, updateDue }, status });
    }

    if (status === 'CuratorProposed') {
      return this.#registry.createType('PalletBountiesBountyStatus', { curatorProposed: { curator }, status });
    }

    throw new Error('Unsupported status');
  };

  public bountyWith = ({ status = 'Proposed', value = 1 } = {}): PalletBountiesBounty =>
    this.aBounty({ status: this.aBountyStatus(status), value: balanceOf(value) });

  public aBounty = ({ fee = balanceOf(10), status = this.aBountyStatus('Proposed'), value = balanceOf(500) }: Partial<PalletBountiesBounty> = {}): PalletBountiesBounty =>
    this.#registry.createType<PalletBountiesBounty>('Bounty', { fee, status, value });
}
