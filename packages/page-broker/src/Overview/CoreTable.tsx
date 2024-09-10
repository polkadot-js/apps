// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import { type CoreWorkloadType, type CoreWorkplanType } from '../types.js';
import Workload from './Workload.js';

interface Props {
  api: ApiPromise;
  core: number;
  workload?: CoreWorkloadType[],
  workplan?: CoreWorkplanType[],
  timeslice: number,
}

function CoreTable ({ api, core, timeslice, workload, workplan }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef<([React.ReactNode?, string?] | false)[]>([[t('core')]]);
  const header: [React.ReactNode?, string?, number?, (() => void)?][] = [
    [
      <div key={`header${core}`}>{headerRef.current} {core} <span></span></div>,
      'core',
      8,
      undefined
    ]
  ];

  return (
    <Table
      emptySpinner={true}
      header={header}
      isSplit={false}
      key={core}
    >
      {workload?.map((v) => (
        <Workload
          api={api}
          key={v.core}
          timeslice={timeslice}
          value={v}
          workplan={workplan}
        />
      ))}
    </Table>
  );
}

export default React.memo(CoreTable);
