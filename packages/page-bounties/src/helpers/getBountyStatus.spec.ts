// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TypeRegistry } from '@polkadot/types/create';

import { getBountyStatus } from './getBountyStatus';

describe('get bounty status', () => {
  let registry: TypeRegistry;

  beforeEach(() => {
    registry = new TypeRegistry();
  });

  it('for CuratorProposed state it has curator defined', () => {
    const bountyStatus = getBountyStatus(registry.createType('BountyStatus', 'CuratorProposed'));

    expect(bountyStatus.bountyStatus).toEqual('CuratorProposed');
    expect(bountyStatus.curator).toBeDefined();
  });

  it('for Active state it has curator and update due defined', () => {
    const bountyStatus = getBountyStatus(registry.createType('BountyStatus', 'Active'));

    expect(bountyStatus.bountyStatus).toEqual('Active');
    expect(bountyStatus.curator).toBeDefined();
    expect(bountyStatus.updateDue).toBeDefined();
  });

  it('for PendingPayout state it has curator, beneficiary and unlock_at defined', () => {
    const bountyStatus = getBountyStatus(registry.createType('BountyStatus', 'PendingPayout'));

    expect(bountyStatus.bountyStatus).toEqual('PendingPayout');
    expect(bountyStatus.curator).toBeDefined();
    expect(bountyStatus.beneficiary).toBeDefined();
    expect(bountyStatus.unlockAt).toBeDefined();
  });
});
