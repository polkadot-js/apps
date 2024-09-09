// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreWorkload, CoreWorkplan } from '@polkadot/react-hooks/types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Workload from './Workload.js';

interface Props {
  api: ApiPromise;
  core: number;
  workload?: CoreWorkload[],
  workplan?: CoreWorkplan[],
  timeslice: number,
}

function CoreTable ({ api, core, timeslice, workload, workplan }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef<([React.ReactNode?, string?] | false)[]>([[t('core')]]);
  const header = [[<div key={`header${core}`}>{headerRef.current} {core} <span></span></div>, 'core', 8]];

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
