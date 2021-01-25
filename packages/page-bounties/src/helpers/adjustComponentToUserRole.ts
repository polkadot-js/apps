// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BountyStatus } from '@polkadot/types/interfaces';

import BN from 'bn.js';

import { DisplaySlashCuratorType, UserRole } from '@polkadot/app-bounties';
import { BN_ZERO } from '@polkadot/util';

export function adjustComponentToUserRole (role: UserRole, status: BountyStatus, blocksUntilUpdate?: BN): DisplaySlashCuratorType {
  if (status.isCuratorProposed && role === 'Member') return 'UnassignCurator';

  if (status.isActive) {
    if (role === 'Curator') return 'GiveUp';
    if (role === 'Member') return 'SlashCuratorMotion';
    if (role === 'User' && blocksUntilUpdate && blocksUntilUpdate.lt(BN_ZERO)) return 'SlashCuratorAction';
  }

  if (status.isPendingPayout && role === 'Member') return 'SlashCuratorMotion';

  return 'Hide';
}
