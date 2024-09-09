// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreDescription, CoreWorkload, CoreWorkplan, LegacyLease, Reservation } from '@polkadot/react-hooks/types';
import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';

import React, { useEffect, useMemo, useState } from 'react';

import { Dropdown, Input, styled } from '@polkadot/react-components';
import { useCall, useDebounce } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import { Occupancy } from '../types.js';
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
  reservations: Reservation[],
  leases: LegacyLease[],
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

const getOccupancyType = (lease: LegacyLease | undefined, reservation: Reservation | undefined): Occupancy => {
  return reservation ? Occupancy.Reservation : lease ? Occupancy.Lease : Occupancy.Rent;
};

function Overview ({ api, apiEndpoint, className, isReady, leases, reservations, workloadInfos, workplanInfos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [workloadCoreSelected, setWorkloadCoreSelected] = useState(-1);
  const [workLoad, setWorkLoad] = useState<CoreWorkload[]>();
  const [workPlan, setWorkPlan] = useState<CoreWorkplan[]>();
  const [_parachainId, setParachainId] = useState<string>('');
  const parachainId = useDebounce(_parachainId);
  const [coreArr, setCoreArr] = useState<number[]>([]);

  useEffect(() => {
    setWorkPlan(workplanInfos?.map((w) => {
      const lease = leases.find((c) => c.task === w.info.task);
      const reservation: Reservation | undefined = reservations.find((c) => c.task === w.info.task);

      return {
        ...w,
        lastBlock: lease?.until,
        type: getOccupancyType(lease, reservation)
      };
    }));
  }, [workplanInfos, leases, reservations]);

  useEffect(() => {
    const newCoreArr = Array.from({ length: workloadInfos?.length || 0 }, (_, index) => index);

    setCoreArr(newCoreArr);
    setWorkLoad(workloadInfos?.map((w) => {
      const lease = leases.find((c) => c.task === w.info.task);
      const reservation = reservations.find((c) => c.task === w.info.task);

      return {
        ...w,
        lastBlock: lease?.until,
        type: getOccupancyType(lease, reservation)
      };
    }));
  }, [workloadInfos, leases, reservations]);

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

  function onDropDownChange (v: number) {
    setWorkloadCoreSelected(v);
    setParachainId('');
  }

  function onInputChange (v: string) {
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
