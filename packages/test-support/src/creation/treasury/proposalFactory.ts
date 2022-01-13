// Copyright 2017-2022 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';

import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { aHash } from '@polkadot/test-support/creation/hashes';
import { alice, bob } from '@polkadot/test-support/keyring/addresses';

export interface ProposalFactory {
  aProposal: (extrinsic: SubmittableExtrinsic<'promise'>, ayes?: string[], nays?: string[]) => DeriveCollectiveProposal
}

export function proposalFactory (api: ApiPromise): ProposalFactory {
  const registry = api.registry;

  return {
    aProposal: (extrinsic, ayes = [alice], nays = [bob]) => ({
      hash: aHash(),
      proposal: registry.createType('Proposal', extrinsic),
      votes: registry.createType('Votes', {
        ayes: ayes,
        index: 0,
        nays: nays,
        threshold: 4
      })
    })
  };
}
