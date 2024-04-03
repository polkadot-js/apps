// Copyright 2017-2024 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0
import type { CoreWorkloadInfo } from '../types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Workload from './Workload.js';

interface Props {
  className?: string;
  workloadInfos?: CoreWorkloadInfo[] | CoreWorkloadInfo;
}

function Workloads ({ className, workloadInfos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  let sanitized:CoreWorkloadInfo[] = [];

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('workload'), 'start', 1],
    [t('mask'), 'start media--1300'],
    [t('assignment'), 'start media--1600'],
  ]);
  if (Array.isArray(workloadInfos)) {
    sanitized = workloadInfos
  } else if (workloadInfos) {
    sanitized.push(workloadInfos)
  }

  sanitized?.sort((a, b) => a.core - b.core);

  return (
    <Table
      className={className}
      empty={workloadInfos && t('No workload found')}
      header={headerRef.current}
    >

      {sanitized?.map((v) => (
        <Workload
          key={v.core}
          value={v}
        />
      ))}
    </Table>
  );
}

export default React.memo(Workloads);
