// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreDescription } from '@polkadot/react-hooks/types';
import type { PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor } from '@polkadot/types/lookup';

import React from 'react';

import { Table } from '@polkadot/react-components';

import CoreQueue from './CoreQueue.js';
import CurrentWork from './CurrentWork.js';

interface Props {
  className?: string;
  value: CoreDescription;
}

function CoreDescriptor ({ value: { core, info } }: Props): React.ReactElement<Props> {
  let sanitized: PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor[] = [];

  if (Array.isArray(info)) {
    sanitized = info;
  } else if (info) {
    sanitized.push(info);
  }

  return (
    <>
      <Table.Column.Id value={Number(core)} />
      {sanitized?.map((i) => (
        <td
          key={core}
        >
          <CurrentWork
            value={i.currentWork.unwrapOr(undefined)}
          />
        </td>
      ))
      }
      {sanitized?.map((i) => (
        <td
          key={core}
        >
          <CoreQueue
            value={i.queue.unwrapOr(undefined)}
          />
        </td>
      ))}
    </>
  );
}

export default React.memo(CoreDescriptor);
