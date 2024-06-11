// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreWorkplanInfo } from '@polkadot/react-hooks/types';
import type { PalletBrokerCoretimeInterfaceCoreAssignment } from '@polkadot/types/lookup';

import React from 'react';

import { ExpandButton } from '@polkadot/react-components';
import { useRegions, useToggle } from '@polkadot/react-hooks';

import { hexToBin } from '../utils.js';

interface Props {
  className?: string;
  api: ApiPromise;
  value: CoreWorkplanInfo;
}

function Workplan ({ api, value: { core, info, timeslice } }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const infoVec: [PalletBrokerCoretimeInterfaceCoreAssignment, number][] = [];

  info.forEach((data) => {
    const trimmedHex: string = data.mask.toHex().slice(2);
    const arr: string[] = trimmedHex.split('');
    const buffArr: string[] = [];

    arr.forEach((bit) => {
      hexToBin(bit).split('').forEach((v) => buffArr.push(v));
    });
    buffArr.filter((v) => v === '1');
    infoVec.push([data.assignment, buffArr.length / 80 * 100]);
  });

  const needsExpansion = infoVec.length > 1;

  const regionInfo = useRegions(api);

  regionInfo?.filter((v) => v.core === core && v.start >= timeslice);

  return (
    <>
      {infoVec.map((data, index) => (
        <tr key={index}>
          <td>
            <h5>{'Assignment'}</h5>
            {data[0].isTask ? data[0].asTask.toString() : data[0].toString()}
          </td>
          <td>
            <h5>{'Mask'}</h5>
            {`${data[1]}%`}
          </td>
          {needsExpansion && index === 1 &&
            <ExpandButton
              expanded={isExpanded}
              onClick={toggleIsExpanded}
            />}
          {isExpanded &&
            <tr>
              <td>
                <h5>{'Lease start'}</h5>
                {regionInfo?.[0].start.toString()}
              </td>
              <td>
                <h5>{'Lease end'}</h5>
                {regionInfo?.[0].end.toString()}
              </td>
            </tr>
          }
        </tr>
      ))}
    </>
  );
}

export default React.memo(Workplan);
