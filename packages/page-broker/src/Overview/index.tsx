// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreWorkload, CoreWorkplan, LegacyLease, Reservation } from '@polkadot/react-hooks/types';
import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';

import React, { useEffect, useMemo, useState } from 'react';

import { useApi, useBrokerLeases, useBrokerReservations, useCall, useWorkloadInfos, useWorkplanInfos } from '@polkadot/react-hooks';

import { type CoreWorkloadType, type CoreWorkplanType } from '../types.js';
import { createTaskMap, getOccupancyType } from '../utils.js';
import CoresTable from './CoresTables.js';
import Filters from './Filters.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  apiEndpoint?: LinkOption | null;
  api: ApiPromise;
  isReady: boolean;
}

const formatLoad = (data: CoreWorkplan[] | CoreWorkload[] | undefined, leaseMap: Record<number, LegacyLease>, reservationMap: Record<number, Reservation>): CoreWorkloadType[] | CoreWorkplanType[] => {
  if (!data) {
    return [];
  }

  return data.map((w: CoreWorkload | CoreWorkplan) => {
    const result = {
      ...w,
      lastBlock: leaseMap[w.info.task as number]?.until || 0,
      type: getOccupancyType(leaseMap[w.info.task as number], reservationMap[w.info.task as number])
    };

    if ('timeslice' in w) {
      return result as CoreWorkplanType;
    } else {
      return result as CoreWorkloadType;
    }
  });
};

function Overview ({ api, apiEndpoint, className, isReady }: Props): React.ReactElement<Props> {
  const [workLoad, setWorkLoad] = useState<CoreWorkloadType[] | undefined>();
  const [workPlan, setWorkPlan] = useState<CoreWorkplanType[]>();
  const [filtered, setFiltered] = useState<CoreWorkloadType[]>();
  const { isApiReady } = useApi();

  const status = useCall<PalletBrokerStatusRecord>(isReady && api.query.broker?.status);
  const workloadInfos: CoreWorkload[] | undefined = useWorkloadInfos(api, isApiReady);
  const workplanInfos: CoreWorkplan[] | undefined = useWorkplanInfos(api, isApiReady);
  const reservations: Reservation[] | undefined = useBrokerReservations(api, isApiReady);
  const leases: LegacyLease[] | undefined = useBrokerLeases(api, isApiReady);

  const leaseMap = useMemo(() => leases ? createTaskMap(leases) : [], [leases]);
  const reservationMap = useMemo(() => reservations ? createTaskMap(reservations) : [], [reservations]);

  const timesliceAsString = useMemo(() => {
    if (!!status && !!status?.toHuman()) {
      const timeslice = status?.toHuman().lastCommittedTimeslice?.toString();

      return timeslice === undefined ? '' : timeslice.toString().split(',').join('');
    }

    return '0';
  }, [status]);

  useEffect(() =>
    setWorkPlan(formatLoad(workplanInfos, leaseMap, reservationMap))
  , [workplanInfos, leaseMap, reservationMap]);

  useEffect(() => {
    setWorkLoad(formatLoad(workloadInfos, leaseMap, reservationMap));
  }, [workloadInfos, leaseMap, reservationMap]);

  return (
    <div className={className}>
      <Summary
        apiEndpoint={apiEndpoint}
        workloadInfos={workLoad}
      ></Summary>
      {!!workPlan?.length &&
        (<>
          <Filters
            onFilter={setFiltered}
            workLoad={workLoad}
          />
          <CoresTable
            api={api}
            timeslice={Number(timesliceAsString)}
            workloadInfos={filtered || workLoad}
            workplanInfos={workPlan}
          />
        </>)
      }
      {!workPlan?.length && <p style={{ marginLeft: '22px', marginTop: '3rem', opacity: 0.7 }}> No data currently available</p>}
    </div>
  );
}

export default React.memo(Overview);
