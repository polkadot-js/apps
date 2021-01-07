// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from '@polkadot/keyring/types';

import BN from 'bn.js';

import { ApiPromise } from '@polkadot/api';
import { aliceSigner } from '@polkadot/test-support/keyring';
import { execute } from '@polkadot/test-support/transaction';

import { acceptMotion, fillTreasury, getMotion, proposeMotion } from './helpers';

export async function acceptCurator (api: ApiPromise, id: number, signer: KeyringPair) {
  await execute(api.tx.bounties.acceptCurator(id), signer);
}

export async function awardBounty (api: ApiPromise, index: number, signer: KeyringPair) {
  await execute(api.tx.bounties.awardBounty(index, signer.address), signer);
}

export async function claimBounty (api: ApiPromise, index: number, signer: KeyringPair) {
  await execute(api.tx.bounties.claimBounty(index), signer);
}

export async function proposeBounty (api: ApiPromise, value: BN, title: string, signer: KeyringPair): Promise<number> {
  await execute(api.tx.bounties.proposeBounty(value, title), signer);
  const index = await api.query.bounties.bountyCount();

  return index.toNumber() - 1;
}

export async function proposeBounties (api: ApiPromise, numberOfBounties: number) {
  const indexes = [];

  for (let i = 0; i < numberOfBounties; i++) {
    indexes.push(await proposeBounty(api, new BN(500_000_000_000_000), `new bounty nr ${i} hello hello more bytes`, aliceSigner()));
  }

  return indexes;
}

export async function proposeCurator (api: ApiPromise, index: number, signer: KeyringPair) {
  await proposeMotion(api, api.tx.bounties.proposeCurator(index, signer.address, 10), signer);

  const bountyProposal = await getMotion(api, index);

  await acceptMotion(api, bountyProposal.hash, bountyProposal.votes!.index.toNumber());
}

export async function approveBounty (api: ApiPromise, index: number, signer: KeyringPair) {
  await proposeMotion(api, api.tx.bounties.approveBounty(index), signer);

  const bountyProposal = await getMotion(api, index);

  await acceptMotion(api, bountyProposal.hash, bountyProposal.votes!.index.toNumber());
  await fillTreasury(api, signer);
}

export async function approveBounties (api: ApiPromise, bountyIndexes: number[]) {
  for (const bountyIndex of bountyIndexes) {
    await approveBounty(api, bountyIndex, aliceSigner());
  }

  // await bountyIndexes.forEach(async (bountyIndex) => await approveBounty(api, bountyIndex, aliceSigner()));
}
