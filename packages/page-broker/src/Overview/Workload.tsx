// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreWorkloadInfo } from '@polkadot/react-hooks/types';

import React from 'react';

import { ExpandButton } from '@polkadot/react-components';
import { useRegions, useToggle } from '@polkadot/react-hooks';

interface Props {
  api: ApiPromise;
  value: CoreWorkloadInfo;
  timeslice: number;
  isExpanded?: boolean;
}

function Workload ({ api, timeslice, value: { core, info } }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  const buffArr: string[] = [];

  const regionInfo = useRegions(api);

  regionInfo?.filter((v) => v.core === core && v.start >= timeslice && v.mask === info[0].mask.toHex());

  buffArr.filter((v) => v === '1');

  const sanitizedAssignment = info[0].assignment.isTask ? info[0].assignment.asTask : info[0].assignment;

  return (
    <><tr>
      <td>
        <h5>{'Assignment'}</h5>
        {sanitizedAssignment.toString()}
      </td>
      <td>
        <h5>{'Mask'}</h5>
        {`${buffArr.length / 80 * 100}%`}
      </td>
      <ExpandButton
        expanded={isExpanded}
        onClick={toggleIsExpanded}
      />
    </tr>
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
    </>
  );
}

export default React.memo(Workload);
