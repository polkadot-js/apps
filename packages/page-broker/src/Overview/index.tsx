// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkload, CoreWorkplan, LegacyLease, Reservation } from '@polkadot/react-hooks/types';
import type { CoreInfo, CoreWorkloadType } from '../types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { useApi, useBrokerLeases, useBrokerReservations, useBrokerStatus, useWorkloadInfos, useWorkplanInfos } from '@polkadot/react-hooks';

import { createTaskMap, getOccupancyType } from '../utils.js';
import CoresTable from './CoresTables.js';
import Filters from './Filters.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
}

const formatData = (coreCount: number, workplan: CoreWorkplan[], workload: CoreWorkload[], leaseMap: Record<number, LegacyLease>, reservationMap: Record<number, Reservation>): CoreInfo[] => {
  return Array.from({ length: coreCount }, (_, coreNumber) => {
    const process = (data: CoreWorkload[] | CoreWorkplan[]) => {
      return data
        .filter((load) => load.core === coreNumber)
        .map((one) => ({
          ...one,
          lastBlock: leaseMap[one?.info.task as number]?.until || 0,
          maskBits: one.info.maskBits,
          task: one.info.task,
          type: getOccupancyType(leaseMap[one.info.task as number] as LegacyLease, reservationMap[one.info.task as number] as Reservation)
        }));
    };

    const coreData = {
      core: coreNumber,
      workload: workload?.length ? process(workload) : [],
      workplan: workplan?.length ? process(workplan) : []
    };

    return coreData;
  });
};

function Overview({ className }: Props): React.ReactElement<Props> {
  const { api, apiEndpoint, isApiReady } = useApi();
  const [data, setData] = useState<CoreInfo[]>();

  const [filtered, setFiltered] = useState<CoreInfo[]>();
  const coreCount = useBrokerStatus('coreCount') || '-';

  const workloadInfos: CoreWorkload[] | undefined = useWorkloadInfos(api, isApiReady);
  const workplanInfos: CoreWorkplan[] | undefined = useWorkplanInfos(api, isApiReady);
  const reservations: Reservation[] | undefined = useBrokerReservations(api, isApiReady);
  const leases: LegacyLease[] | undefined = useBrokerLeases(api, isApiReady);

  const leaseMap = useMemo(() => leases ? createTaskMap(leases) : [], [leases]);
  const reservationMap = useMemo(() => reservations ? createTaskMap(reservations) : [], [reservations]);

  useEffect(() => {
    !!workplanInfos && !!workloadInfos && !!coreCount && !!leaseMap && !!reservationMap &&
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
            onFilter={setFiltered}
            data={data}
          />
          <CoresTable
            api={api}
            data={filtered}
          />
        </>)
      }
      {!data?.length && <p style={{ marginLeft: '22px', marginTop: '3rem', opacity: 0.7 }}> No data currently available</p>}
    </div>
  );
}

export default React.memo(Overview);
