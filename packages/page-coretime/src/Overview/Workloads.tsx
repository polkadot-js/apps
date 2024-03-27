// Copyright 2017-2024 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { CoreWorkloadInfo } from '../types.js'

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Workload from './Workload.js';



interface Props {
  className?: string;
  workloadInfos?: CoreWorkloadInfo[];
}

function Workloads ({ className, workloadInfos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('workload'), 'start', 1],
    [t('mask'), 'start media--1300'],
    [t('assignment'), 'start media--1600'],
    []
  ]);

  workloadInfos?.sort((a, b) => a.core - b.core);


  return (
    <Table
      className={className}
      empty={workloadInfos && t('No workload found')}
      header={headerRef.current}
    >
      {workloadInfos?.map((workloadInfo) => (
        <Workload
          key={workloadInfo.core}
          value={workloadInfo}
        />
      ))}
    </Table>
  );
}

export default React.memo(Workloads);
