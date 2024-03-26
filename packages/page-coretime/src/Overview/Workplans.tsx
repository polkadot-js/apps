// Copyright 2017-2024 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { CoreWorkplanInfo } from '../types.js'

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Workplan from './Workplan.js';



interface Props {
  className?: string;
  workplanInfos?: CoreWorkplanInfo[];
}

function Workplans ({ className, workplanInfos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('workplan'), 'start', 1],
    [t('mask'), 'start media--1600'],
    [t('assignment'), 'start media--1600'],
    [t('timeslice'), 'start media--1900'],
    []
  ]);

  workplanInfos?.sort((a, b) => a.core - b.core);

  return (
    <Table
      className={className}
      empty={workplanInfos && t('No workṕlan found')}
      header={headerRef.current}
    >
      {workplanInfos?.map((workplanInfo) => (
        <Workplan
          key={workplanInfo.core}
          value={workplanInfo}
        />
      ))}
    </Table>
  );
}

export default React.memo(Workplans);
