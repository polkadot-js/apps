// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkloadInfo } from '@polkadot/react-hooks/types';

import React from 'react';

import Workload from './Workload.js';

interface Props {
  workloadInfos?: CoreWorkloadInfo[];
}

function Workloads ({ workloadInfos }: Props): React.ReactElement<Props> {
  return (
    <>
      {workloadInfos?.map((v) => (
        <Workload
          key={v.core}
          value={v}
        />
      ))}
    </>
  );
}

export default React.memo(Workloads);
