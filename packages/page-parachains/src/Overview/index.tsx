// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import Actions from './Actions';
import Parachains from './ParachainList';
import Proposals from './Proposals';
import Summary from './Summary';
import Upcoming from './UpcomingList';
import useProposals from './useProposals';

interface Props {
  className?: string;
}

function Overview (): React.ReactElement<Props> {
  const { api } = useApi();
  const paraIds = useCall<ParaId[]>(api.query.paras?.parachains);
  const upcomingIds = useCall<ParaId[]>(api.query.paras?.upcomingParas);
  const proposals = useProposals();

  return (
    <>
      <Summary
        parachainCount={paraIds?.length}
        proposalCount={proposals?.proposalIds.length}
        upcomingCount={upcomingIds?.length}
      />
      <Actions />
      {api.query.paras && (
        <>
          <Parachains ids={paraIds} />
          <Upcoming ids={upcomingIds} />
        </>
      )}
      {api.query.proposeParachain && (
        <Proposals proposals={proposals} />
      )}
    </>
  );
}

export default React.memo(Overview);
