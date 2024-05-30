// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkloadInfo } from '@polkadot/react-hooks/types';

import React from 'react';

import { Columar } from '@polkadot/react-components';

import { hexToBin } from '../utils.js';

interface Props {
  value: CoreWorkloadInfo;
}

function Workload ({ value: { info } }: Props): React.ReactElement<Props> {
  const trimmedHex: string = info[0].mask.toHex().slice(2);
  const arr: string[] = trimmedHex.split('');

  const buffArr: string[] = [];

  arr.forEach((bit) => {
    hexToBin(bit).split('').forEach((v) => buffArr.push(v));
  });

  buffArr.filter((v) => v === '1');

  const sanitizedAssignment = info[0].assignment.isTask ? info[0].assignment.asTask : info[0].assignment;

  return (
    <Columar>
      <Columar.Column>
        <h5>{'Assignment'}</h5>
        <td className='start'>{sanitizedAssignment.toString()}</td>
      </Columar.Column>
      <Columar.Column>
        <h5>{'Mask'}</h5>
        <td>{`${buffArr.length / 80 * 100}%`}</td>
      </Columar.Column>
    </Columar>

  );
}

export default React.memo(Workload);
