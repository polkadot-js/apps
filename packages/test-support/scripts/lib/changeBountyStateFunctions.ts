// Copyright 2017-2022 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { BN } from '@polkadot/util';

import { execute } from '@polkadot/test-support/transaction';

import { acceptMotion, fillTreasury, getMotion, proposeMotion } from './helpers';

export async function acceptCurator (api: ApiPromise, id: number, signer: KeyringPair): Promise<void> {
  await execute(api.tx.bounties.acceptCurator(id), signer);
}

export async function awardBounty (api: ApiPromise, index: number, signer: KeyringPair): Promise<void> {
  await execute(api.tx.bounties.awardBounty(index, signer.address), signer);
}

export async function claimBounty (api: ApiPromise, index: number, signer: KeyringPair): Promise<void> {
  await execute(api.tx.bounties.claimBounty(index), signer);
}

export async function proposeBounty (api: ApiPromise, value: BN, title: string, signer: KeyringPair): Promise<number> {
  await execute(api.tx.bounties.proposeBounty(value, title), signer);
  const index = await api.query.bounties.bountyCount();

  return index.toNumber() - 1;
}

export async function proposeCurator (api: ApiPromise, index: number, signer: KeyringPair): Promise<void> {
  await proposeMotion(api, api.tx.bounties.proposeCurator(index, signer.address, 10), signer);
  const bountyProposal = await getMotion(api, index);

  await acceptMotion(api, bountyProposal.hash, bountyProposal.votes?.index.toNumber() ?? 0);
}

export async function approveBounty (api: ApiPromise, index: number, signer: KeyringPair): Promise<void> {
  await proposeMotion(api, api.tx.bounties.approveBounty(index), signer);

  const bountyProposal = await getMotion(api, index);

  await acceptMotion(api, bountyProposal.hash, bountyProposal.votes?.index.toNumber() ?? 0);
  await fillTreasury(api, signer);
}
