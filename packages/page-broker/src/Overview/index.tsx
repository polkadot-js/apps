// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreDescription, CoreWorkloadInfo, CoreWorkplanInfo } from '@polkadot/react-hooks/types';

import React, { useEffect, useMemo, useState } from 'react';

import { Button, Dropdown } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import CoresTable from './CoresTables.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  workloadInfos?: CoreWorkloadInfo[];
  workplanInfos?: CoreWorkplanInfo[];
  coreInfos?: CoreDescription[];
  apiEndpoint?: LinkOption | null;
}

function Overview ({ apiEndpoint, className, workloadInfos, workplanInfos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [workloadCoreSelected, setWorkloadCoreSelected] = useState(-1);
  let workplanCoreSelected = -1;
  const [coreArr, setCoreArr] = useState<number[]>([]);

  useEffect(() => {
    // Your coreArr initialization logic goes here
    const newCoreArr = Array.from({ length: workloadInfos?.length || 0 }, (_, index) => index);

    setCoreArr(newCoreArr);
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
    () => {
      workplanCoreSelected = workloadCoreSelected
      return workloadCoreSelected === -1 ? workloadInfos : workloadInfos?.filter(({ core }) => core === workloadCoreSelected);
    },
    [workloadInfos, workloadCoreSelected, workplanCoreSelected]
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
          label={t('selected core')}
          onChange={setWorkloadCoreSelected}
          options={workloadCoreOpts}
          value={workloadCoreSelected}
        />
      </Button.Group>
      <CoresTable
        cores={workloadCoreSelected}
        workloadInfos={filteredWLC}
        workplanInfos={filteredWorkplan}
      />
    </div>
  );
}

export default React.memo(Overview);
