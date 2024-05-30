// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreDescription, CoreWorkloadInfo, CoreWorkplanInfo } from '@polkadot/react-hooks/types';

import React, { useEffect, useMemo, useState } from 'react';

import { Button, Dropdown } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import CoresTable from './CoresTables.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  api?: ApiPromise
  workloadInfos?: CoreWorkloadInfo[];
  workplanInfos?: CoreWorkplanInfo[];
  coreInfos?: CoreDescription[];
  apiEndpoint?: LinkOption | null;
}

function uniqByForEach (array: CoreWorkplanInfo[] | undefined) {
  const workplanCores: number[] = [];
  const workplanTS: number[] = [];

  if (array) {
    array.forEach((item) => {
      if (!workplanCores.includes(item.core)) {
        workplanCores.push(item.core);
      }

      if (!workplanTS.includes(item.timeslice)) {
        workplanTS.push(item.timeslice);
      }
    });

    return { workplanCores, workplanTS };
  } else {
    return { workplanCores: [], workplanTS: [] };
  }
}

function Overview ({ api, apiEndpoint, className, workloadInfos, workplanInfos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [workloadCoreSelected, setWorkloadCoreSelected] = useState(-1);
  const [workplanCoreSelected, setWorkplanCoreSelected] = useState(-1);
  const [coreArr, setCoreArr] = useState<number[]>([]);

  useEffect(() => {
    // Your coreArr initialization logic goes here
    const newCoreArr = Array.from({ length: workloadInfos?.length || 0 }, (_, index) => index);

    setCoreArr(newCoreArr);
  }, [workloadInfos]);

  const { workplanCores, workplanTS } = uniqByForEach(workplanInfos);

  workplanCores?.sort((a, b) => a - b);
  workplanTS?.sort((a, b) => a - b);

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
    () => {
      return workloadCoreSelected === -1 ? workloadInfos : workloadInfos?.filter(({ core }) => core === workloadCoreSelected);
    },
    [workloadInfos, workloadCoreSelected]
  );
  const workplanCoreOpts = useMemo(
    () => [{ text: t('All scehduled cores'), value: -1 }].concat(
      workplanCores
        .map((c) =>
          ({
            text: `Core ${c}`,
            value: c
          })
        )
        .filter((v): v is { text: string, value: number } => !!v.text)
    ),
    [workplanCores, t]
  );

  const filteredWorkplan = useMemo(
    () => {
      if (workplanCoreSelected === -1) {
        return workplanInfos;
      } else {
        return workplanInfos?.filter(({ core }) => core === workplanCoreSelected);
      }
    }
    ,
    [workplanInfos, workplanCoreSelected]
  );

  return (
    <div className={className}>
      <Summary
        apiEndpoint={apiEndpoint}
        workloadInfos={workloadInfos}
      ></Summary>
      <Button.Group>
        <Dropdown
          className='start media--800'
          label={t('selected core for workload')}
          onChange={setWorkloadCoreSelected}
          options={workloadCoreOpts}
          value={workloadCoreSelected}
        />
        <Dropdown
          className='start media--1200'
          label={t('selected core for workplan')}
          onChange={setWorkplanCoreSelected}
          options={workplanCoreOpts}
          value={workplanCoreSelected}
        />
      </Button.Group>
      <CoresTable
        api={api}
        workloadInfos={filteredWLC}
        workplanInfos={filteredWorkplan}
      />
    </div>
  );
}

export default React.memo(Overview);
