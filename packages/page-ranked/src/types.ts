// Copyright 2017-2022 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletRankedCollectiveMemberRecord } from '@polkadot/types/lookup';

export type PalletColl = 'rankedCollective' | 'fellowshipCollective';

export type PalletPoll = 'rankedPolls' | 'fellowshipReferenda';

export interface Member {
  accountId: string;
  info: PalletRankedCollectiveMemberRecord;
}
