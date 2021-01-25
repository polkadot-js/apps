// Copyright 2017-2021 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { aliceSigner } from '@polkadot/test-support/keyring';

import { waitForBountyState, waitForClaim } from './bountyWaitFunctions';
import { acceptCurator, approveBounty, awardBounty, claimBounty, proposeBounty, proposeCurator } from './changeBountyStateFunctions';
import { FUNDING_TIME, PAYOUT_TIME } from './constants';

export async function multiProposeBounty (api: ApiPromise, numberOfBounties: number): Promise<number[]> {
  const indexes = [];

  for (let i = 0; i < numberOfBounties; i++) {
    indexes.push(await proposeBounty(api, new BN(500_000_000_000_000), `new bounty no ${i}`, aliceSigner()));
  }

  return indexes;
}

export async function multiApproveBounty (api: ApiPromise, bountyIndexes: number[]): Promise<void> {
  for (const bountyIndex of bountyIndexes) {
    await approveBounty(api, bountyIndex, aliceSigner());
  }
}

export async function multiWaitForBountyFunded (api: ApiPromise, bountyIndexes: number[]): Promise<void> {
  const waitFunctions = bountyIndexes.map((bountyIndex) =>
    waitForBountyState(api, 'isFunded', bountyIndex, { interval: 2000, timeout: FUNDING_TIME }));

  await Promise.all(waitFunctions);
}

export async function multiProposeCurator (api: ApiPromise, bountyIndexes: number[], signers: KeyringPair[]): Promise<void> {
  for (let i = 0; i < bountyIndexes.length; i++) {
    await proposeCurator(api, bountyIndexes[i], signers[i]);
  }
}

export async function multiAcceptCurator (api: ApiPromise, bountyIndexes: number[], signers: KeyringPair[]): Promise<void> {
  const acceptFunctions = bountyIndexes.map((bountyIndex, index) =>
    acceptCurator(api, bountyIndex, signers[index]));

  await Promise.all(acceptFunctions);
}

export async function multiAwardBounty (api: ApiPromise, bountyIndexes: number[], signers: KeyringPair[]): Promise<void> {
  const awardFunctions = bountyIndexes.map((bountyIndex, index) =>
    awardBounty(api, bountyIndex, signers[index]));

  await Promise.all(awardFunctions);
}

export async function multiWaitForClaim (api: ApiPromise, bountyIndexes: number[]): Promise<void> {
  for (const index of bountyIndexes) {
    await waitForClaim(api, index, { interval: 2000, timeout: PAYOUT_TIME });
  }
}

export async function multiClaimBounty (api: ApiPromise, bountyIndexes: number[], signers: KeyringPair[]): Promise<void> {
  const awardFunctions = bountyIndexes.map((bountyIndex, index) =>
    claimBounty(api, bountyIndex, signers[index]));

  await Promise.all(awardFunctions);
}
