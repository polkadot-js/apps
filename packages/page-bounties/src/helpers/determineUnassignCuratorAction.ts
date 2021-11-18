// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { BountyStatus } from '@polkadot/types/interfaces';

import { BN_ZERO } from '@polkadot/util';

import { UserRole, ValidUnassignCuratorAction } from '../types';

export function determineUnassignCuratorAction (roles: UserRole[], status: BountyStatus, blocksUntilUpdate?: BN): ValidUnassignCuratorAction[] {
  const actions: ValidUnassignCuratorAction[] = [];

  if (status.isCuratorProposed && roles.includes('Member')) {
    actions.push('UnassignCurator');
  }

  if (status.isActive) {
    if (roles.includes('Member')) {
      actions.push('SlashCuratorMotion');
    }

    if (roles.includes('User') && blocksUntilUpdate && blocksUntilUpdate.lt(BN_ZERO)) {
      actions.push('SlashCuratorAction');
    }
  }

  if (status.isPendingPayout && roles.includes('Member')) {
    actions.push('SlashCuratorMotion');
  }

  return actions;
}
