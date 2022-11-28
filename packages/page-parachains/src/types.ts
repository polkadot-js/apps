// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AuctionIndex, BalanceOf, BlockNumber, LeasePeriodOf, ParachainProposal, ParaId, SessionIndex } from '@polkadot/types/interfaces';
import type { PolkadotParachainPrimitivesHrmpChannelId, PolkadotRuntimeCommonCrowdloanFundInfo, PolkadotRuntimeCommonParasRegistrarParaInfo, PolkadotRuntimeParachainsHrmpHrmpChannel } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export type ChannelMap = Record<string, [PolkadotParachainPrimitivesHrmpChannelId, PolkadotRuntimeParachainsHrmpHrmpChannel][]>;

export interface AllChannels {
  dst: ChannelMap;
  src: ChannelMap;
}

export interface LeaseInfo {
  accountId: AccountId;
  balance: BalanceOf;
  period: number;
}

export interface QueuedAction {
  paraIds: ParaId[];
  sessionIndex: BN;
}

export interface AuctionInfo {
  endBlock: BlockNumber | null;
  leasePeriod: LeasePeriodOf | null;
  numAuctions: AuctionIndex;
}

export interface ProposalExt {
  id: ParaId;
  isApproved: boolean;
  isScheduled: boolean;
  proposal?: ParachainProposal;
}

export interface ScheduledProposals {
  scheduledIds: ParaId[];
  sessionIndex: SessionIndex;
}

export interface Campaigns {
  activeCap: BN;
  activeRaised: BN;
  funds: Campaign[] | null;
  totalCap: BN;
  totalRaised: BN;
}

export interface Campaign extends WinnerData {
  info: PolkadotRuntimeCommonCrowdloanFundInfo;
  isCapped?: boolean;
  isEnded?: boolean;
  isWinner?: boolean;
}

export interface LeasePeriod {
  currentPeriod: BN;
  length: BN;
  progress: BN;
  remainder: BN;
}

export interface Proposals {
  approvedIds: ParaId[];
  proposalIds: ParaId[];
  scheduled: ScheduledProposals[];
}

export interface OwnedIdPartial {
  manager: string;
  paraId: ParaId;
  paraInfo: PolkadotRuntimeCommonParasRegistrarParaInfo;
}

export interface OwnedId extends OwnedIdPartial {
  hasCode: boolean;
}

export interface OwnerInfo {
  accountId: string | null;
  paraId: number;
}

export interface WinnerData {
  accountId: string;
  firstSlot: BN;
  isCrowdloan: boolean;
  key: string;
  lastSlot: BN;
  paraId: ParaId;
  value: BN;
}

export interface Winning {
  blockNumber: BN;
  blockOffset: BN;
  total: BN;
  winners: WinnerData[];
}
