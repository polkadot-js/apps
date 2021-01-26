// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { Proposals } from '../types';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import Actions from './Actions';
import Parachains from './ParachainList';
import Summary from './Summary';
import Upcoming from './UpcomingList';

interface Props {
  className?: string;
  proposals?: Proposals;
}

function Overview ({ className, proposals }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const paraIds = useCall<ParaId[]>(api.query.paras?.parachains);
  const upcomingIds = useCall<ParaId[]>(api.query.paras?.upcomingParas);

  return (
    <div className={className}>
      <Summary
        parachainCount={paraIds?.length}
        proposalCount={proposals?.proposalIds.length}
        upcomingCount={upcomingIds?.length}
      />
      <Actions />
      {api.query.paras && (
        <>
          <Parachains
            ids={paraIds}
            scheduled={proposals?.scheduled}
          />
          <Upcoming ids={upcomingIds} />
        </>
      )}
    </div>
  );
}

export default React.memo(Overview);
