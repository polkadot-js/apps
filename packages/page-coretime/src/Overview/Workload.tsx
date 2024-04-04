// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkloadInfo } from '../types.js';

import React from 'react';

import { MaskCoverage, Table } from '@polkadot/react-components';

import { hexToBin } from '../utils.js';

interface Props {
  className?: string;
  value: CoreWorkloadInfo;
}

function Workload ({ className, value: { core, info } }: Props): React.ReactElement<Props> {
  const trimmedHex: string = info[0].mask.toHex().slice(2);
  const arr: string[] = trimmedHex.split('');

  const buffArr: string[] = [];

  arr.forEach((bit) => {
    hexToBin(bit).split('').forEach((v) => buffArr.push(v));
  });

  const sanitizedAssignment = info[0].assignment.isTask ? info[0].assignment.asTask : info[0].assignment;

  return (
    <tr className={className}>
      <Table.Column.Id value={Number(core)} />
      <td><MaskCoverage values={buffArr} /></td>
      <td className='start media--1600'>{sanitizedAssignment.toString()}</td>
    </tr>
  );
}

export default React.memo(Workload);
