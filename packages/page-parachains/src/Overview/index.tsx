// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveParachain } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { ParaId, ParachainProposal } from '@polkadot/types/interfaces';
import type { ProposalExt } from './types';

import BN from 'bn.js';
import React from 'react';
import { Button } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Transfer from '../Transfer';
import Parachains from './Parachains';
import Proposals from './Proposals';
import Register from './Register';
import Summary from './Summary';

interface Props {
  isMine?: boolean;
  sudoKey?: string;
}

const transformProposals = {
  transform: (entries: [{ args: [ParaId] }, Option<ParachainProposal>][]): ProposalExt[] => {
    return entries
      .filter(([, opt]) => opt.isSome)
      .map(([{ args: [id] }, optProposal]) => ({ id, proposal: optProposal.unwrap() }));
  }
};

function Overview ({ isMine, sudoKey }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const parachains = useCall<DeriveParachain[]>(api.derive.parachains?.overview);
  const proposals = useCall<ProposalExt[]>(api.query.proposeParachain?.proposals.entries as any, undefined, transformProposals);
  const nextFreeId = useCall<BN>(api.query.registrar?.nextFreeId);

  return (
    <>
      <Summary
        nextFreeId={nextFreeId}
        parachainCount={parachains?.length}
        proposalCount={proposals?.length}
      />
      <Button.Group>
        <Transfer parachains={parachains} />
        {api.query.parachains && (
          <Register
            isDisabled={!isMine}
            nextFreeId={nextFreeId}
            sudoKey={sudoKey}
          />
        )}
      </Button.Group>
      {api.query.parachains && (
        <Parachains parachains={parachains} />
      )}
      {api.query.proposeParachain && (
        <Proposals proposals={proposals} />
      )}
    </>
  );
}

export default React.memo(Overview);
