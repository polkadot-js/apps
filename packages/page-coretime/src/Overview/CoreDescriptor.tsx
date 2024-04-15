// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor } from '@polkadot/types/lookup';
import type { CoreDescription } from '../types.js';

import React from 'react';

import { Table } from '@polkadot/react-components';

import CoreQueue from './CoreQueue.js';
import CurrentWork from './CurrentWork.js';

interface Props {
  className?: string;
  value: CoreDescription;
}

function CoreDescriptor ({ className, value: { core, info } }: Props): React.ReactElement<Props> {
  let sanitized: PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor[] = [];

  if (Array.isArray(info)) {
    sanitized = info;
  } else if (info) {
    sanitized.push(info);
  }

  return (
    <tr className={className}>
      <Table.Column.Id value={Number(core)} />
      {sanitized?.map((i) => (
        <CurrentWork
          key={core}
          value={i.currentWork.unwrapOr(undefined)}
        />
      ))
      }
      {sanitized?.map((i) => (
        <CoreQueue
          key={core}
          value={i.queue.unwrapOr(undefined)}
        />
      ))}
    </tr>
  );
}

export default React.memo(CoreDescriptor);
