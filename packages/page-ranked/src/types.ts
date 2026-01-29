// Copyright 2017-2025 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletRankedCollectiveMemberRecord } from '@polkadot/types/lookup';

export type PalletColl = 'rankedCollective' | 'fellowshipCollective' | 'ambassadorCollective';

export type PalletPoll = 'rankedPolls' | 'fellowshipReferenda' | 'ambassadorReferenda';

export interface Member {
  accountId: string;
  info: PalletRankedCollectiveMemberRecord;
}
