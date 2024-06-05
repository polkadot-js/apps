// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreWorkplanInfo } from '@polkadot/react-hooks/types';

import React from 'react';

import Workplan from './Workplan.js';

interface Props {
  className?: string;
  api: ApiPromise;
  workplanInfos?: CoreWorkplanInfo[] | CoreWorkplanInfo;
}

function Workplans ({ api, workplanInfos }: Props): React.ReactElement<Props> {
  let sanitized: CoreWorkplanInfo[] = [];

  if (Array.isArray(workplanInfos)) {
    sanitized = workplanInfos;
  } else if (workplanInfos) {
    sanitized.push(workplanInfos);
  }

  sanitized?.sort((a, b) => a.core - b.core);

  return (
    <>
      {sanitized?.map((workplanInfo) => (
        <Workplan
          api={api}
          key={workplanInfo.core}
          value={workplanInfo}
        />
      ))}
    </>
  );
}

export default React.memo(Workplans);
