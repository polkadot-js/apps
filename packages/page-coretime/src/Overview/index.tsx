// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreDescription, CoreWorkloadInfo, CoreWorkplanInfo } from '@polkadot/react-hooks/types';

import React, { useMemo, useState } from 'react';

import { Button, Columar, Dropdown } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import CoreDescriptors from './CoreDescriptors.js';
import Summary from './Summary.js';
import Workloads from './Workloads.js';
import Workplans from './Workplans.js';

interface Props {
  className?: string;
  workloadInfos?: CoreWorkloadInfo[];
  workplanInfos?: CoreWorkplanInfo[];
  coreInfos?: CoreDescription[];
  relay?: boolean;
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

function Overview ({ className, coreInfos, relay, workloadInfos, workplanInfos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [workloadCoreSelected, setWorkloadCoreSelected] = useState(-1);
  const [workplanCoreSelected, setWorkplanCoreSelected] = useState(-1);
  const [workplanSliceSelected, setWorkplanSliceSelected] = useState(-1);
  const workloadCores = workloadInfos?.length;

  const coreArr: number[] = useMemo(() => [], []);

  const len = workloadCores || 0;

  Array(len).fill(0).map((_, index) => coreArr.push(index));

  const { workplanCores, workplanTS } = uniqByForEach(workplanInfos);

  workplanCores?.sort((a, b) => a - b);
  workplanTS?.sort((a, b) => a - b);

  const workloadCoreOpts = useMemo(
    () => [{ text: t('All active/available cores'), value: -1 }].concat(
      coreArr
        .map((c) => ({
          text: `Core ${c}`,
          value: c
        }))
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
        .map((c) => ({
          text: `Core ${c}`,
          value: c
        }))
        .filter((v): v is { text: string, value: number } => !!v.text)
    ),
    [workplanCores, t]
  );

  const filteredWorkplan = useMemo(
    () => {
      if (workplanCoreSelected === workplanSliceSelected) {
        return workplanInfos;
      } else if (workplanCoreSelected === -1) {
        return workplanInfos?.filter(({ timeslice }) => timeslice === workplanSliceSelected);
      } else if (workplanSliceSelected === -1) {
        return workplanInfos?.filter(({ core }) => core === workplanCoreSelected);
      } else {
        return workplanInfos?.filter(({ core, timeslice }) => core === workplanCoreSelected && timeslice === workplanSliceSelected);
      }
    }
    ,
    [workplanInfos, workplanCoreSelected, workplanSliceSelected]
  );

  const workplanTSOpts = useMemo(
    () => [{ text: t('All available slices'), value: -1 }].concat(
      workplanTS
        .map((ts) => ({
          text: `Timeslice ${ts}`,
          value: ts
        }))
        .filter((v): v is { text: string, value: number } => !!v.text)
    ),
    [workplanTS, t]
  );

  if (relay) {
    return (
      <div className={className}>
        <Summary relay={relay}></Summary>
        <Columar>
          <Columar.Column>
            <CoreDescriptors coreInfos={coreInfos} />
          </Columar.Column>
        </Columar>
      </div>
    );
  } else {
    return (
      <div className={className}>
        <Summary></Summary>
        <Button.Group>
          <Dropdown
            className='topDropdown media--800'
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
          <Dropdown
            className='start media--1600'
            label={t('selected timeslice')}
            onChange={setWorkplanSliceSelected}
            options={workplanTSOpts}
            value={workplanSliceSelected}
          />
        </Button.Group>
        <Columar>
          <Columar.Column>
            <Workloads
              workloadInfos={filteredWLC}
            />
          </Columar.Column>
          <Columar.Column>
            <Workplans
              filteredWorkplan={filteredWorkplan}
            />
          </Columar.Column>
        </Columar>
      </div>
    );
  }
}

export default React.memo(Overview);
