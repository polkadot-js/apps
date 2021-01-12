// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { ParachainProposal, ParaId } from '@polkadot/types/interfaces';
import type { ProposalExt } from './types';

import { useEffect, useState } from 'react';

import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';

function createExt (approvedIds: ParaId[], entries: [{ args: [ParaId] }, Option<ParachainProposal>][]): ProposalExt[] {
  return entries
    .filter(([, opt]) => opt.isSome)
    .map(([{ args: [id] }, optProposal]) => ({
      id,
      isApproved: approvedIds.some((a) => a.eq(id)),
      proposal: optProposal.unwrap()
    }));
}

export default function useProposals (): ProposalExt[] | undefined {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<ProposalExt[] | undefined>();
  const approvedIds = useCall<ParaId[]>(api.query.proposeParachains?.approvedProposals);

  useEffect((): void => {
    approvedIds && api.query.proposeParachain.proposals
      .entries()
      .then((entries) =>
        mountedRef.current && setState(createExt(approvedIds, entries as any))
      )
      .catch(console.error);
  }, [api, approvedIds, mountedRef]);

  return state;
}
