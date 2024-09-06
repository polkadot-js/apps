// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreDescription, CoreWorkloadInfo, CoreWorkplanInfo } from '@polkadot/react-hooks/types';
import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';

import React, { useEffect, useMemo, useState } from 'react';

import { Dropdown, Input, styled } from '@polkadot/react-components';
import { useCall, useDebounce } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import CoresTable from './CoresTables.js';
import Summary from './Summary.js';
import { Lease, Occupancy, Reservation } from '../types.js';
import { getTaskId } from '../utils.js';

const StyledDiv = styled.div`
  @media (max-width: 768px) {
    max-width: 100%:
  }
`;

interface Props {
  className?: string;
  workloadInfos?: CoreWorkloadInfo[];
  workplanInfos?: CoreWorkplanInfo[];
  reservations: Reservation[],
  leases: Lease[],
  coreInfos?: CoreDescription[];
  apiEndpoint?: LinkOption | null;
  api: ApiPromise;
  isReady: boolean;
}

const filterLoad = (parachainId: string, load: CoreWorkloadInfo[] | CoreWorkplanInfo[], workloadCoreSelected: number) => {
  if (parachainId) {
    return load?.filter(({ info }) => getTaskId(info?.[0]) === parachainId);
  }
  if (workloadCoreSelected === -1) {
    return load;
  }
  return load?.filter(({ core }) => core === workloadCoreSelected);
};

const getOccupancyType = (core: number, taskId: string, leases: Lease[], reservations: Reservation[]) => {
  return !!reservations.find(c => c.core === core) ? Occupancy.Reservation :
    !!leases.find(c => c.task === taskId) ? Occupancy.Lease : Occupancy.Rent
}

function Overview({ api, apiEndpoint, className, isReady, workloadInfos, workplanInfos, reservations, leases }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [workloadCoreSelected, setWorkloadCoreSelected] = useState(-1);
  const [workLoad, setWorkLoad] = useState<Array<CoreWorkloadInfo>>();
  const [workPlan, setWorkPlan] = useState<Array<CoreWorkplanInfo>>();
  const [_parachainId, setParachainId] = useState<string>('');
  const parachainId = useDebounce(_parachainId);
  const [coreArr, setCoreArr] = useState<number[]>([]);

  useEffect(() => {
    setWorkPlan(workplanInfos?.map(w => ({
      ...w,
      type: getOccupancyType(w.core, getTaskId(w.info[0]), leases, reservations)
    })))
  }, [workplanInfos]);

  useEffect(() => {
    const newCoreArr = Array.from({ length: workloadInfos?.length || 0 }, (_, index) => index);
    setCoreArr(newCoreArr);
    setWorkLoad(workloadInfos?.map(w => ({
      ...w,
      type: getOccupancyType(w.core, getTaskId(w.info[0]), leases, reservations)
    })))
  }, [workloadInfos]);

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

  const filteredWLC = useMemo(
    () => workLoad && filterLoad(parachainId, workLoad, workloadCoreSelected),
    [workLoad, workloadCoreSelected, parachainId]
  );

  function onDropDownChange(v: number) {
    setWorkloadCoreSelected(v);
    setParachainId('');
  }

  function onInputChange(v: string) {
    setParachainId(v);
    setWorkloadCoreSelected(-1);
  }

  const status = useCall<PalletBrokerStatusRecord>(isReady && api.query.broker?.status);
  const timeslice = status?.toHuman().lastCommittedTimeslice?.toString();
  const timesliceAsString = timeslice === undefined ? '' : timeslice.toString().split(',').join('');

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
