// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreWorkloadInfo } from '@polkadot/react-hooks/types';

import React from 'react';

import { Columar } from '@polkadot/react-components';
import { useRegions } from '@polkadot/react-hooks';

import { hexToBin } from '../utils.js';

interface Props {
  api: ApiPromise;
  value: CoreWorkloadInfo;
  timeslice: number,
}

function Workload ({ api, timeslice, value: { core, info } }: Props): React.ReactElement<Props> {
  const trimmedHex: string = info[0].mask.toHex().slice(2);
  const arr: string[] = trimmedHex.split('');

  const buffArr: string[] = [];

  arr.forEach((bit) => {
    hexToBin(bit).split('').forEach((v) => buffArr.push(v));
  });

  const regionInfo = useRegions(api);

  regionInfo?.filter((v) => v.core === core && v.start >= timeslice && v.mask === info[0].mask.toHex());

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
      <Columar.Column>
        <h5>{'Lease start'}</h5>
        <td>{timeslice?.toString()}</td>
      </Columar.Column>
      <Columar.Column>
        <h5>{'Lease end'}</h5>
        <td>
          {regionInfo?.[0].end.toString()}
        </td>
      </Columar.Column>
    </Columar>

  );
}

export default React.memo(Workload);
