// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0
import type { CoreWorkplanInfo } from '../types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Workplan from './Workplan.js';

interface Props {
  className?: string;
  filteredWorkplan?: CoreWorkplanInfo[] | CoreWorkplanInfo;
}

function Workplans ({ className, filteredWorkplan }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  let sanitized: CoreWorkplanInfo[] = [];

  if (Array.isArray(filteredWorkplan)) {
    sanitized = filteredWorkplan;
  } else if (filteredWorkplan) {
    sanitized.push(filteredWorkplan);
  }

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('workplan'), 'start', 1],
    [t('mask'), 'start media--1600'],
    [t('assignment'), 'start media--1600'],
    [t('timeslice'), 'start media--1900']
  ]);

  sanitized?.sort((a, b) => a.core - b.core);

  return (
    <Table
      className={className}
      empty={sanitized && t('No workṕlan found')}
      header={headerRef.current}
    >

      {sanitized?.map((workplanInfo) => (
        <Workplan
          key={workplanInfo.core}
          value={workplanInfo}
        />
      ))}
    </Table>
  );
}

export default React.memo(Workplans);
