// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreWorkloadInfo, CoreWorkplanInfo, RegionInfo } from '@polkadot/react-hooks/types';
import type { InfoRow } from '../types.js';

import React, { useEffect, useState } from 'react';

import { ExpandButton } from '@polkadot/react-components';
import { useRegions, useToggle } from '@polkadot/react-hooks';

import { formatWorkInfo } from '../utils.js';
import WorkInfoRow from './WorkInfoRow.js';
import Workplan from './Workplan.js';

interface Props {
  api: ApiPromise;
  value: CoreWorkloadInfo;
  timeslice: number;
  workplan?: CoreWorkplanInfo[] | null,
}

function Workload ({ api, timeslice, value: { core, info }, workplan }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const [tableData, setTableData] = useState<InfoRow[]>();
  const [currentRegion, setCurrentRegion] = useState<RegionInfo | undefined>();
  const regionInfo = useRegions(api);

  useEffect(() => {
    if (info) {
      const region: RegionInfo | undefined = regionInfo?.find((v) => v.core === core && v.start <= timeslice && v.end > timeslice);

      setTableData(formatWorkInfo(info, core, region, timeslice));
      setCurrentRegion(region);
    }
  }, [info, regionInfo, core, timeslice]);

  const hasWorkplan = !!workplan?.length;

  return (
    <>
      {
        tableData?.map((data) => (
          <tr
            className={`isExpanded isFirst ${isExpanded ? '' : 'isLast'}`}
            key={data.core}
          >
            <WorkInfoRow data={data} />
            <td style={{ paddingRight: '2rem', textAlign: 'right', verticalAlign: 'top' }}>
              <h5 style={{ opacity: '0.6' }}>Workplan</h5>
              {hasWorkplan &&
                (<ExpandButton
                  expanded={isExpanded}
                  onClick={toggleIsExpanded}
                />)
              }
              {!hasWorkplan && 'none'}
            </td>
          </tr>
        ))
      }
      {isExpanded &&
        <>
          <tr>
            <td style={{ fontWeight: 700, paddingTop: '2rem', width: 150 }}>workplans</td>
            <td colSpan={6}></td>
          </tr>
          {workplan?.map((workplanInfo) => (
            <Workplan
              currentTimeSlice={timeslice}
              isExpanded={isExpanded}
              key={workplanInfo.core}
              region={currentRegion}
              value={workplanInfo}
            />
          ))}

        </>
      }
    </>
  );
}

export default React.memo(Workload);
