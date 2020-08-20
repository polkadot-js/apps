// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ParaId, ParachainProposal } from '@polkadot/types/interfaces';

export interface ProposalExt {
  id: ParaId;
  proposal: ParachainProposal;
}
