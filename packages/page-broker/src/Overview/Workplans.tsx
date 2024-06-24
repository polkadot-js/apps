// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreWorkplanInfo } from '@polkadot/react-hooks/types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import Workplan from './Workplan.js';

interface Props {
  className?: string;
  api: ApiPromise;
  workplanInfos?: CoreWorkplanInfo[] | CoreWorkplanInfo;
}

function Workplans ({ api, workplanInfos }: Props): React.ReactElement<Props> {
  const headerRef = useRef<([React.ReactNode?, string?] | false)[]>([
    ['workplans'],
    []
  ]);

  let sanitized: CoreWorkplanInfo[] = [];

  if (Array.isArray(workplanInfos)) {
    sanitized = workplanInfos;
  } else if (workplanInfos) {
    sanitized.push(workplanInfos);
  }

  sanitized?.sort((a, b) => a.core - b.core);

  return (
    <div style={{ verticalAlign: 'top', width: '55em' }}>
      <Table
        empty={'No workplan found'}
        header={headerRef.current}
      >
        {sanitized?.map((workplanInfo) => (
          <Workplan
            api={api}
            key={workplanInfo.core}
            value={workplanInfo}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Workplans);
