// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreDescription, CoreWorkload, CoreWorkplan, LegacyLease, Reservation } from '@polkadot/react-hooks/types';
import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';

import React, { useEffect, useMemo, useState } from 'react';

import { Dropdown, Input, styled } from '@polkadot/react-components';
import { useApi, useBrokerLeases, useBrokerReservations, useCall, useDebounce, useWorkloadInfos, useWorkplanInfos } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import { createTaskMap, getOccupancyType } from '../utils.js';
import CoresTable from './CoresTables.js';
import Summary from './Summary.js';

const StyledDiv = styled.div`
  @media (max-width: 768px) {
    max-width: 100%:
  }
`;

interface Props {
  className?: string;
  workloadInfos?: CoreWorkload[];
  workplanInfos?: CoreWorkplan[];
  reservations?: Reservation[],
  leases?: LegacyLease[],
  coreInfos?: CoreDescription[];
  apiEndpoint?: LinkOption | null;
  api: ApiPromise;
  isReady: boolean;
}

const filterLoad = (parachainId: string, load: CoreWorkload[] | CoreWorkplan[], workloadCoreSelected: number) => {
  if (parachainId) {
    return load?.filter(({ info }) => info.task === parachainId);
  }

  if (workloadCoreSelected === -1) {
    return load;
  }

  return load?.filter(({ core }) => core === workloadCoreSelected);
};

const formatLoad = (data: CoreWorkplan[] | CoreWorkload[] | undefined, leaseMap: Record<number, LegacyLease>, reservationMap: Record<number, Reservation>) => {
  if (!data) {
    return [];
  }

  return data?.map((w: CoreWorkload | CoreWorkplan) =>
  ({
    ...w,
    lastBlock: !!leaseMap && leaseMap[w.info.task as number]?.until,
    type: getOccupancyType(leaseMap[w.info.task as number], reservationMap[w.info.task as number])
  })
  );
};

function Overview({ api, apiEndpoint, className, isReady }: Props): React.ReactElement<Props> {
  const [workloadCoreSelected, setWorkloadCoreSelected] = useState(-1);
  const [workLoad, setWorkLoad] = useState<CoreWorkload[] | undefined>();
  const [workPlan, setWorkPlan] = useState<CoreWorkplan[]>();
  const [_parachainId, setParachainId] = useState<string>('');
  const [coreArr, setCoreArr] = useState<number[]>([]);
  const { isApiReady } = useApi();

  const { t } = useTranslation();
  const status = useCall<PalletBrokerStatusRecord>(isReady && api.query.broker?.status);
  const parachainId = useDebounce(_parachainId);
  const workloadInfos: CoreWorkload[] | undefined = useWorkloadInfos(api, isApiReady);
  const workplanInfos: CoreWorkplan[] | undefined = useWorkplanInfos(api, isApiReady);
  const reservations: Reservation[] | undefined = useBrokerReservations(api, isApiReady);
  const leases: LegacyLease[] | undefined = useBrokerLeases(api, isApiReady);

  const leaseMap = useMemo(() => leases && createTaskMap(leases), [leases]);
  const reservationMap = useMemo(() => reservations && createTaskMap(reservations), [reservations]);

  const timesliceAsString = useMemo(() => {
    const timeslice = status?.toHuman().lastCommittedTimeslice?.toString();

    return timeslice === undefined ? '' : timeslice.toString().split(',').join('');
  }, [status]);

  useEffect(() => {
    console.log(workplanInfos);
    setWorkPlan(formatLoad(workplanInfos, leaseMap, reservationMap));
  }, [workplanInfos, leaseMap, reservationMap]);

  useEffect(() => {
    const newCoreArr = Array.from({ length: workloadInfos?.length || 0 }, (_, index) => index);

    setCoreArr(newCoreArr);
    setWorkLoad(formatLoad(workloadInfos, leaseMap, reservationMap));
  }, [workloadInfos, leaseMap, reservationMap]);

  const workloadCoreOpts = useMemo(
    () => [{ text: t('All active/available cores'), value: -1 }].concat(
      coreArr
        .map((c) => (
          {
            text: `Core ${c}`,
            value: c
          }
        ))
        .filter((v): v is { text: string, value: number } => !!v.text)
    ),
    [coreArr, t]
  );

  const filteredWLC = useMemo(() => workLoad && filterLoad(parachainId, workLoad, workloadCoreSelected), [workLoad, workloadCoreSelected, parachainId]);

  function onDropDownChange(v: number) {
    setWorkloadCoreSelected(v);
    setParachainId('');
  }

  function onInputChange(v: string) {
    setParachainId(v);
    setWorkloadCoreSelected(-1);
  }

  return (
    <div className={className}>
      <Summary
        apiEndpoint={apiEndpoint}
        workloadInfos={workloadInfos}
      ></Summary>
      <StyledDiv style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxWidth: '300px' }}>
        <Dropdown
          className='isSmall'
          label={t('selected core')}
          onChange={onDropDownChange}
          options={workloadCoreOpts}
          value={workloadCoreSelected}
        />
        <div style={{ minWidth: '150px' }}>
          <Input
            className='full isSmall'
            label={t('parachain id')}
            onChange={onInputChange}
            placeholder={t('parachain id')}
            value={_parachainId}
          /></div>
      </StyledDiv>
      <CoresTable
        api={api}
        cores={workloadCoreSelected}
        timeslice={Number(timesliceAsString)}
        workloadInfos={filteredWLC}
        workplanInfos={workPlan}
      />
    </div>
  );
}

export default React.memo(Overview);
