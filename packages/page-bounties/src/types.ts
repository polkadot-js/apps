// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BlockNumber } from '@polkadot/types/interfaces/runtime';

export interface BountyStatusType {
  beneficiary: AccountId | undefined;
  bountyStatus: StatusName;
  curator: AccountId | undefined;
  unlockAt: BlockNumber | undefined;
  updateDue: BlockNumber | undefined;
}

export type HelpMessages = Record<StatusName, string>;

export type StatusName = 'Active' | 'Approved' | 'CuratorProposed' | 'Funded' | 'PendingPayout' | 'Proposed';
export type BountyVotingStatuses = { [status in StatusName]: string[] };
export type ValidUnassignCuratorAction = 'UnassignCurator' | 'SlashCuratorMotion' | 'SlashCuratorAction';
export type UnassignCuratorAction = ValidUnassignCuratorAction | 'None';
export type UserRole = 'User' | 'Member' | 'Curator' | 'None';
