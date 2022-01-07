// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { determineUnassignCuratorAction } from '@polkadot/app-bounties/helpers/determineUnassignCuratorAction';
import { createAugmentedApi } from '@polkadot/test-support/api';
import { BountyFactory } from '@polkadot/test-support/creation/bounties/bountyFactory';
import { BN } from '@polkadot/util';

describe('adjust slash curator component for', () => {
  const augmentedApi = createAugmentedApi();
  const { aBountyStatus } = new BountyFactory(augmentedApi);

  it('Member in Active state', () => {
    const displayAs = determineUnassignCuratorAction(['Member'], aBountyStatus('Active'));

    expect(displayAs).toEqual(['SlashCuratorMotion']);
  });

  it('Member in CuratorProposed state', () => {
    const displayAs = determineUnassignCuratorAction(['Member'], aBountyStatus('CuratorProposed'));

    expect(displayAs).toEqual(['UnassignCurator']);
  });

  it('Member in PendingPayout state', () => {
    const displayAs = determineUnassignCuratorAction(['Member'], aBountyStatus('PendingPayout'));

    expect(displayAs).toEqual(['SlashCuratorMotion']);
  });

  it('User in Active state with update due blocks remaining', () => {
    const displayAs = determineUnassignCuratorAction(['User'], aBountyStatus('Active'), new BN('1'));

    expect(displayAs).toEqual([]);
  });

  it('User in Active state with no updated state', () => {
    const displayAs = determineUnassignCuratorAction(['User'], aBountyStatus('Active'), new BN('-1'));

    expect(displayAs).toEqual(['SlashCuratorAction']);
  });

  it('Member and User in Active state with no updated state', () => {
    const displayAs = determineUnassignCuratorAction(['User', 'Member'], aBountyStatus('Active'), new BN('-1'));

    expect(displayAs).toEqual(expect.arrayContaining(['SlashCuratorAction', 'SlashCuratorMotion']));
  });

  it('Curator in Active state', () => {
    const displayAs = determineUnassignCuratorAction(['Curator'], aBountyStatus('PendingPayout'));

    expect(displayAs).toEqual([]);
  });

  it('User in Active state', () => {
    const displayAs = determineUnassignCuratorAction(['User'], aBountyStatus('PendingPayout'));

    expect(displayAs).toEqual([]);
  });
});
