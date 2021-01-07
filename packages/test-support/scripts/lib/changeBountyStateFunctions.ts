// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from '@polkadot/keyring/types';

import BN from 'bn.js';

import { ApiPromise } from '@polkadot/api';
import { aliceSigner } from '@polkadot/test-support/keyring';
import { execute } from '@polkadot/test-support/transaction';
import { waitForBountyState, waitForClaim } from '@polkadot/test-support/utils/waitFor';

import { FUNDING_TIME, PAYOUT_TIME } from './constants';
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
}

export async function waitForBountiesFunding (api: ApiPromise, bountyIndexes: number[]) {
  const waitFunctions = bountyIndexes.map((bountyIndex) =>
    waitForBountyState(api, 'isFunded', bountyIndex, { interval: 2000, timeout: FUNDING_TIME }));

  await Promise.all(waitFunctions);
}

export async function proposeCurators (api: ApiPromise, bountyIndexes: number[], signers: KeyringPair[]): Promise<void> {
  for (let i = 0; i < bountyIndexes.length; i++) {
    await proposeCurator(api, bountyIndexes[i], signers[i]);
  }
}

export async function acceptCurators (api: ApiPromise, bountyIndexes: number[], signers: KeyringPair[]): Promise<void> {
  const acceptFunctions = bountyIndexes.map((bountyIndex, index) =>
    acceptCurator(api, bountyIndex, signers[index]));

  await Promise.all(acceptFunctions);
}

export async function awardBounties (api: ApiPromise, bountyIndexes: number[], signers: KeyringPair[]): Promise<void> {
  const awardFunctions = bountyIndexes.map((bountyIndex, index) =>
    awardBounty(api, bountyIndex, signers[index]));

  await Promise.all(awardFunctions);
}

export async function waitForClaims (api: ApiPromise, bountyIndexes: number[]) {
  for (const index of bountyIndexes) {
    await waitForClaim(api, index, { interval: 2000, timeout: PAYOUT_TIME });
  }
}

export async function claimBounties (api: ApiPromise, bountyIndexes: number[], signers: KeyringPair[]) {
  const awardFunctions = bountyIndexes.map((bountyIndex, index) =>
    claimBounty(api, bountyIndex, signers[index]));

  await Promise.all(awardFunctions);
}
