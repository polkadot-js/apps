// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreDescription, CoreWorkloadInfo, CoreWorkplanInfo } from '@polkadot/react-hooks/types';
import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';

import React, { useEffect, useMemo, useState } from 'react';

import { Dropdown, Input } from '@polkadot/react-components';
import { useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import CoresTable from './CoresTables.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  workloadInfos?: CoreWorkloadInfo[];
  workplanInfos?: CoreWorkplanInfo[];
  coreInfos?: CoreDescription[];
  apiEndpoint?: LinkOption | null;
  api: ApiPromise;
  isReady: boolean;
}

function Overview ({ api, apiEndpoint, className, isReady, workloadInfos, workplanInfos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [workloadCoreSelected, setWorkloadCoreSelected] = useState(-1);
  const [parachainId, setParachainId] = useState('');
  const [coreArr, setCoreArr] = useState<number[]>([]);

  useEffect(() => {
    const newCoreArr = Array.from({ length: workloadInfos?.length || 0 }, (_, index) => index);

    setCoreArr(newCoreArr);
  }, [workloadInfos]);

  const workloadCoreOpts = useMemo(
    () => [{ text: t('All active/available cores'), value: -1 }].concat(
      coreArr
        .map((c) => (
          {
            text: `Core ${c + 1}`,
            value: c
          }
        ))
        .filter((v): v is { text: string, value: number } => !!v.text)
    ),
    [coreArr, t]
  );
  const filteredWLC = useMemo(
    () => {
      return workloadCoreSelected === -1 ? workloadInfos : workloadInfos?.filter(({ core }) => core === workloadCoreSelected);
    },
    [workloadInfos, workloadCoreSelected]
  );

  const filteredWorkplan = useMemo(
    () => {
      if (workloadCoreSelected === -1) {
        return workplanInfos;
      } else {
        return workplanInfos?.filter(({ core }) => core === workloadCoreSelected);
      }
    }
    ,
    [workplanInfos, workloadCoreSelected]
  );

  const status = useCall<PalletBrokerStatusRecord>(isReady && api.query.broker?.status);
  const timeslice = status?.toHuman().lastCommittedTimeslice?.toString();
  const timesliceAsString = timeslice === undefined ? '' : timeslice.toString().split(',').join('');

  return (
    <div className={className}>
      <Summary
        apiEndpoint={apiEndpoint}
        workloadInfos={workloadInfos}
      ></Summary>
      <div>
        <Dropdown
          className='start media--800'
          label={t('selected core')}
          onChange={setWorkloadCoreSelected}
          options={workloadCoreOpts}
          value={workloadCoreSelected}
        />
        <Input
          autoFocus
          label={t('parachain id')}
          onChange={setParachainId}
          placeholder={t('parachain id')}
          value={parachainId}
        />

      </div>
      <CoresTable
        api={api}
        cores={workloadCoreSelected}
        timeslice={Number(timesliceAsString)}
        workloadInfos={filteredWLC}
        workplanInfos={filteredWorkplan}
      />
    </div>
  );
}

export default React.memo(Overview);
