// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { Proposals } from '../types';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import Actions from './Actions';
import Parachains from './Parachains';
import Summary from './Summary';
import Upcomings from './Upcomings';
import useActionsQueue from './useActionsQueue';
import useLeasePeriod from './useLeasePeriod';
import useUpcomingIds from './useUpcomingIds';

interface Props {
  className?: string;
  proposals?: Proposals;
}

function Overview ({ className, proposals }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const paraIds = useCall<ParaId[]>(api.query.paras?.parachains);
  const actionsQueue = useActionsQueue();
  const leasePeriod = useLeasePeriod();
  const upcomingIds = useUpcomingIds();

  return (
    <div className={className}>
      <Summary
        leasePeriod={leasePeriod}
        parachainCount={paraIds?.length}
        proposalCount={proposals?.proposalIds.length}
        upcomingCount={upcomingIds?.length}
      />
      <Actions />
      {api.query.paras && (
        <>
          <Parachains
            actionsQueue={actionsQueue}
            ids={paraIds}
            scheduled={proposals?.scheduled}
          />
          <Upcomings
            actionsQueue={actionsQueue}
            currentPeriod={leasePeriod && leasePeriod.currentPeriod}
            ids={upcomingIds}
          />
        </>
      )}
    </div>
  );
}

export default React.memo(Overview);
