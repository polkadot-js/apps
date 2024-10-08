// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkload, CoreWorkplan, LegacyLease, Reservation } from '@polkadot/react-hooks/types';
import type { CoreInfo } from '../types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { useApi, useBrokerLeases, useBrokerReservations, useBrokerStatus, useWorkloadInfos, useWorkplanInfos } from '@polkadot/react-hooks';

import { createTaskMap, getOccupancyType } from '../utils.js';
import CoresTable from './CoresTables.js';
import Filters from './Filters.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
}

type LeaseMapType = Record<number, LegacyLease>
type ReservationMapType = Record<number, Reservation>

const formatDataObject = (one: CoreWorkplan | CoreWorkload, leaseMap: LeaseMapType, reservationMap: ReservationMapType) => ({
  ...one,
  lastBlock: leaseMap[one?.info.task as number]?.until || 0,
  maskBits: one.info.maskBits,
  task: one.info.task,
  type: getOccupancyType(leaseMap[one.info.task as number], reservationMap[one.info.task as number])
});

const formatData = (coreCount: number, workplan: CoreWorkplan[], workload: CoreWorkload[], leaseMap: LeaseMapType, reservationMap: ReservationMapType): CoreInfo[] => {
  return Array.from({ length: coreCount }, (_, coreNumber) => {
    const processWorkload = (data: CoreWorkload[]) => data
      .filter((load) => load.core === coreNumber)
      .map((one) => (formatDataObject(one, leaseMap, reservationMap)));

    const processWorkplan = (data: CoreWorkplan[]) => data
      .filter((load) => load.core === coreNumber)
      .map((one) => ({
        ...formatDataObject(one, leaseMap, reservationMap),
        timeslice: one.timeslice
      }));

    const coreData = {
      core: coreNumber,
      workload: workload?.length ? processWorkload(workload) : [],
      workplan: workplan?.length ? processWorkplan(workplan) : []
    };

    return coreData;
  });
};

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { api, apiEndpoint, isApiReady } = useApi();
  const [data, setData] = useState<CoreInfo[]>([]);

  const [filtered, setFiltered] = useState<CoreInfo[]>();
  const coreCount = useBrokerStatus('coreCount') || '-';

  const workloadInfos: CoreWorkload[] | undefined = useWorkloadInfos(api, isApiReady);
  const workplanInfos: CoreWorkplan[] | undefined = useWorkplanInfos(api, isApiReady);
  const reservations: Reservation[] | undefined = useBrokerReservations(api, isApiReady);
  const leases: LegacyLease[] | undefined = useBrokerLeases(api, isApiReady);

  const leaseMap: LeaseMapType = useMemo(() => leases ? createTaskMap(leases) : [], [leases]);
  const reservationMap: ReservationMapType = useMemo(() => reservations ? createTaskMap(reservations) : [], [reservations]);

  useEffect(() => {
    !!workplanInfos && !!workloadInfos && !!coreCount &&
      setData(formatData(Number(coreCount), workplanInfos, workloadInfos, leaseMap, reservationMap));
  }, [workplanInfos, workloadInfos, leaseMap, reservationMap, coreCount]);

  return (
    <div className={className}>
      <Summary
        apiEndpoint={apiEndpoint}
        coreCount={coreCount}
        workloadInfos={workloadInfos}
      ></Summary>
      {!!data?.length &&
        (<>
          <Filters
            data={data}
            onFilter={setFiltered}
          />
          {!!filtered && (
            <CoresTable
              api={api}
              data={filtered}
            />
          )}
        </>)
      }
      {!data?.length && <p style={{ marginLeft: '22px', marginTop: '3rem', opacity: 0.7 }}> No data currently available</p>}
    </div>
  );
}

export default React.memo(Overview);
