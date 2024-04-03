// Copyright 2017-2024 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkloadInfo } from '../types.js';

import React from 'react';

import { Table } from '@polkadot/react-components';

interface Props {
  className?: string;
  value: CoreWorkloadInfo;
}

function hexToBin(hex: string): string {
  return parseInt(hex, 16).toString(2);
}


function Workload({ className, value: { core, info } }: Props): React.ReactElement<Props> {
  const maskAsPerc = info[0].mask.bitLength() / 80 * 100;
  const trimmedHex: string = info[0].mask.toHex().slice(2);
  const arr: string[] = trimmedHex.split("");

  let buffArr: string = '';

  arr.forEach((bit) => {
    buffArr = buffArr.concat(hexToBin(bit))
  })


  const sanitizedAssignment = info[0].assignment.isTask ? info[0].assignment.asTask : info[0].assignment;

  return (
    <tr className={className}>
      <Table.Column.Id value={Number(core)} />
      <td className='start media--1300'>{`${maskAsPerc} %`}</td>
      <td className='start media--1600'>{sanitizedAssignment.toString()}</td>
    </tr>
  );
}

export default React.memo(Workload);
