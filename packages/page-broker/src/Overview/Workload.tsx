// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { RegionInfo } from '@polkadot/react-hooks/types';
import type { CoreWorkloadType, CoreWorkplanType, InfoRow } from '../types.js';

import React, { useEffect, useState } from 'react';

import { ExpandButton } from '@polkadot/react-components';
import { useRegions, useToggle } from '@polkadot/react-hooks';

import { formatRowInfo } from '../utils.js';
import WorkInfoRow from './WorkInfoRow.js';
import Workplan from './Workplan.js';

interface Props {
  api: ApiPromise;
  value: CoreWorkloadType
  timeslice: number;
  workplan?: CoreWorkplanType[] | null
}

function Workload ({ api, timeslice, value: { core, info, lastBlock, type }, workplan }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const [tableData, setTableData] = useState<InfoRow>();
  const [currentRegion, setCurrentRegion] = useState<RegionInfo | undefined>();
  const regionInfo = useRegions(api);

  useEffect(() => {
    if (info) {
      const region: RegionInfo | undefined = regionInfo?.find((v) => v.core === core && v.start <= timeslice && v.end > timeslice);

      setTableData(formatRowInfo(info, core, region, timeslice, type, lastBlock));
      setCurrentRegion(region);
    }
  }, [info, regionInfo, core, timeslice, lastBlock, type]);

  const hasWorkplan = !!workplan?.length;

  return (
    <>
      {tableData &&
        <tr
          className={`isExpanded isFirst ${isExpanded ? '' : 'isLast'}`}
          key={tableData.core}
        >
          <WorkInfoRow data={tableData} />
          <td style={{ paddingRight: '2rem', textAlign: 'right', verticalAlign: 'top' }}>
            <h5 style={{ opacity: '0.6' }}>Workplan ({workplan?.length})</h5>
            {hasWorkplan &&
              (
                <ExpandButton
                  expanded={isExpanded}
                  onClick={toggleIsExpanded}
                />
              )
            }
            {!hasWorkplan && 'none'}
          </td>
        </tr>
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
