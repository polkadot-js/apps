// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaReferendumInfoConvictionVotingTally } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export interface Referendum {
  id: BN;
  info: PalletReferendaReferendumInfoConvictionVotingTally;
  key: string;
}

export type PalletReferenda = 'referenda';

export type PalletVote = 'convictionVoting';
