// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Method, Proposal } from '@polkadot/types';

export default function isTreasuryProposalVote (proposal?: Proposal | null): boolean {
  if (!proposal) {
    return false;
  }

  const { method, section } = Method.findFunction(proposal.callIndex);

  return section === 'treasury' &&
    ['approveProposal', 'rejectProposal'].includes(method) &&
    !!proposal.args[0];
}
