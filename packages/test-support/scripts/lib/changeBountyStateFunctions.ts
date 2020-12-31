// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { ApiPromise } from '@polkadot/api';
import { aliceSigner, daveSigner } from '@polkadot/test-support/keyring';
import { execute } from '@polkadot/test-support/transaction';

import { acceptMotion, fillTreasury, proposeMotion } from './helpers';

export async function acceptCurator (api: ApiPromise, id: number) {
  await execute(api.tx.bounties.acceptCurator(id), aliceSigner());
}

export async function awardBounty (api: ApiPromise, index: number) {
  await execute(api.tx.bounties.awardBounty(index, daveSigner().address), aliceSigner());
}

export async function claimBounty (api: ApiPromise, index: number) {
  await execute(api.tx.bounties.claimBounty(index), daveSigner());
}

export async function proposeBounty (api: ApiPromise, value: BN, title: string) {
  await execute(api.tx.bounties.proposeBounty(value, title), aliceSigner());
}

export async function proposeCurator (api: ApiPromise, index: number) {
  await proposeMotion(api, api.tx.bounties.proposeCurator(index, aliceSigner().address, 10));

  const hashes = await api.query.council.proposals();

  await acceptMotion(api, hashes[0], 1);
}

export async function approveBounty (api: ApiPromise, index: number) {
  await proposeMotion(api, api.tx.bounties.approveBounty(index));

  const hashes = await api.query.council.proposals();

  await acceptMotion(api, hashes[0], index);
  await fillTreasury(api);
}
