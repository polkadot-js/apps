// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { registry } from '@canvas-ui/react-api';

import { Proposal } from '@polkadot/types/interfaces';

export default function isTreasuryProposalVote (proposal?: Proposal | null): boolean {
  if (!proposal) {
    return false;
  }

  const { method, section } = registry.findMetaCall(proposal.callIndex);

  return section === 'treasury' &&
    ['approveProposal', 'rejectProposal'].includes(method) &&
    !!proposal.args[0];
}
