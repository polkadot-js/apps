// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreWorkloadInfo, CoreWorkplanInfo } from '@polkadot/react-hooks/types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Workloads from './Workloads.js';
import Workplans from './Workplans.js';

interface Props {
  api: ApiPromise;
  core?: number;
  workload?: CoreWorkloadInfo[],
  workplan?: CoreWorkplanInfo[],
  timeslice: number,
}

function CoreTable ({ api, core, timeslice, workload, workplan }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?] | false)[]>([
    [t('core')],
    [],
    []
  ]);

  return (
    <Table
      header={headerRef.current}
    >
      <Table.Column.Id value={core || 0} />
      <td>
        <Workloads
          api={api}
          timeslice={timeslice}
          workloadInfos={workload}
        />
      </td>
      <td>
        <Workplans
          api={api}
          workplanInfos={workplan}
        />
      </td>
    </Table>
  );
}

export default React.memo(CoreTable);
