// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId, ParachainProposal } from '@polkadot/types/interfaces';

export interface ProposalExt {
  id: ParaId;
  proposal: ParachainProposal;
}
