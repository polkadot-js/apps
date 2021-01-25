// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { adjustComponentToUserRole } from '@polkadot/app-bounties/helpers/adjustComponentToUserRole';
import { createAugmentedApi } from '@polkadot/test-support/api';
import { BountyFactory } from '@polkadot/test-support/creation/bounties/bountyFactory';

describe('adjust slash curator component for', () => {
  const augmentedApi = createAugmentedApi();
  const { aBountyStatus } = new BountyFactory(augmentedApi);

  it('Member in Active state', () => {
    const displayAs = adjustComponentToUserRole('Member', aBountyStatus('Active'));

    expect(displayAs).toEqual('SlashCuratorMotion');
  });

  it('Member in CuratorProposed state', () => {
    const displayAs = adjustComponentToUserRole('Member', aBountyStatus('CuratorProposed'));

    expect(displayAs).toEqual('UnassignCurator');
  });

  it('Member in PendingPayout state', () => {
    const displayAs = adjustComponentToUserRole('Member', aBountyStatus('PendingPayout'));

    expect(displayAs).toEqual('SlashCuratorMotion');
  });

  it('Curator in Active state', () => {
    const displayAs = adjustComponentToUserRole('Curator', aBountyStatus('Active'));

    expect(displayAs).toEqual('GiveUp');
  });

  it('User in Active state with update due blocks remaining', () => {
    const displayAs = adjustComponentToUserRole('User', aBountyStatus('Active'), new BN('1'));

    expect(displayAs).toEqual('Hide');
  });

  it('User in Active state with no updated state', () => {
    const displayAs = adjustComponentToUserRole('User', aBountyStatus('Active'), new BN('-1'));

    expect(displayAs).toEqual('SlashCuratorAction');
  });

  it('Curator in Active state', () => {
    const displayAs = adjustComponentToUserRole('Curator', aBountyStatus('PendingPayout'));

    expect(displayAs).toEqual('Hide');
  });

  it('User in Active state', () => {
    const displayAs = adjustComponentToUserRole('User', aBountyStatus('PendingPayout'));

    expect(displayAs).toEqual('Hide');
  });
});
