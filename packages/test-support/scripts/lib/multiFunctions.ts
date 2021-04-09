// Copyright 2017-2021 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { execute } from '@polkadot/test-support/transaction';

import { waitForBountyState, waitForClaim } from './bountyWaitFunctions';
import { FUNDING_TIME, PAYOUT_TIME } from './constants';
import { extractHashesFromProposals,
  extractIndexesFromProposals,
  fillTreasury,
  multiAcceptMotion,
  multiGetMotion,
  multiProposeMotion } from './helpers';

export async function multiProposeBounty (api: ApiPromise, numberOfBounties: number, signer: KeyringPair): Promise<number[]> {
  const initialIndex = await api.query.bounties.bountyCount();

  const arr = Array.from({ length: numberOfBounties }, (_, i) => api.tx.bounties.proposeBounty(new BN(500_000_000_000_000), `new bounty no ${i}`));

  await execute(
    api.tx.utility.batch(arr),
    signer
  );
  const endIndex = await api.query.bounties.bountyCount();

  if ((endIndex.sub(initialIndex)).toNumber() !== numberOfBounties) {
    throw new Error('Multi Propose Failed');
  }

  return Array.from({ length: numberOfBounties }, (_, i) => i + initialIndex.toNumber());
}

export async function multiApproveBounty (api: ApiPromise, bountyIndexes: number[], signer: KeyringPair): Promise<void> {
  const extrinsicArray = bountyIndexes.map((index) => api.tx.bounties.approveBounty(index));

  await multiProposeMotion(api, extrinsicArray, signer);

  const bountyProposals = await multiGetMotion(api, bountyIndexes);

  await fillTreasury(api, signer);
  await multiAcceptMotion(api, extractHashesFromProposals(bountyProposals), extractIndexesFromProposals(bountyProposals));
}

export async function multiWaitForBountyFunded (api: ApiPromise, bountyIndexes: number[]): Promise<void> {
  const waitFunctions = bountyIndexes.map((bountyIndex) =>
    waitForBountyState(api, 'isFunded', bountyIndex, { interval: 2000, timeout: FUNDING_TIME }));

  await Promise.all(waitFunctions);
}

export async function multiProposeCurator (api: ApiPromise, bountyIndexes: number[], signer: KeyringPair): Promise<void> {
  const extrinsicArray = bountyIndexes.map((index) => api.tx.bounties.proposeCurator(index, signer.address, 10));

  await multiProposeMotion(api, extrinsicArray, signer);

  const bountyProposals = await multiGetMotion(api, bountyIndexes);

  await multiAcceptMotion(api, extractHashesFromProposals(bountyProposals), extractIndexesFromProposals(bountyProposals));
}

export async function multiAcceptCurator (api: ApiPromise, bountyIndexes: number[], signer: KeyringPair): Promise<void> {
  await execute(
    api.tx.utility.batch(bountyIndexes.map((bountyIndex) => api.tx.bounties.acceptCurator(bountyIndex))),
    signer
  );
}

export async function multiAwardBounty (api: ApiPromise, bountyIndexes: number[], signer: KeyringPair): Promise<void> {
  await execute(
    api.tx.utility.batch(bountyIndexes.map((bountyIndex) => api.tx.bounties.awardBounty(bountyIndex, signer.address))),
    signer
  );
}

export async function multiWaitForClaim (api: ApiPromise, bountyIndexes: number[]): Promise<void> {
  for (const index of bountyIndexes) {
    await waitForClaim(api, index, { interval: 2000, timeout: PAYOUT_TIME });
  }
}

export async function multiClaimBounty (api: ApiPromise, bountyIndexes: number[], signer: KeyringPair): Promise<void> {
  await execute(
    api.tx.utility.batch(bountyIndexes.map((bountyIndex) => api.tx.bounties.claimBounty(bountyIndex))),
    signer
  );
}
