// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { Proposals } from '../types';

import React, { useEffect, useState } from 'react';

import { useApi, useCall, useEventTrigger, useIsMountedRef } from '@polkadot/react-hooks';

import Actions from './Actions';
import Parachains from './Parachains';
import Parathreads from './Parathreads';
import Summary from './Summary';
import Upcomings from './Upcomings';
import useActionsQueue from './useActionsQueue';
import useLeasePeriod from './useLeasePeriod';
import useParathreads from './useParathreads';

interface Props {
  className?: string;
  proposals?: Proposals;
}

function Overview ({ className, proposals }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const paraIds = useCall<ParaId[]>(api.query.paras?.parachains);
  const mountedRef = useIsMountedRef();
  const actionsQueue = useActionsQueue();
  const leasePeriod = useLeasePeriod();
  const threadIds = useParathreads();
  const trigger = useEventTrigger([api.events.session.NewSession, api.events.registrar?.Registered]);
  const [upcomingIds, setUpcomingIds] = useState<ParaId[]>([]);

  useEffect((): void => {
    trigger &&
      api.query.paras?.upcomingParasGenesis
        ?.keys<[ParaId]>()
        .then((keys): void => {
          mountedRef.current &&
            setUpcomingIds(
              keys.map(({ args: [paraId] }) => paraId)
            );
        })
        .catch(console.error);
  }, [api, mountedRef, trigger]);

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
          <Parathreads
            actionsQueue={actionsQueue}
            currentPeriod={leasePeriod && leasePeriod.currentPeriod}
            ids={threadIds}
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
