// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { RegionInfo } from '@polkadot/react-hooks/types';
import type { CoreWorkloadType, CoreWorkplanType, InfoRow } from '../types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { ExpandButton } from '@polkadot/react-components';
import { useRegions, useToggle } from '@polkadot/react-hooks';

import { formatRowInfo } from '../utils.js';
import WorkInfoRow from './WorkInfoRow.js';
import Workplan from './Workplan.js';

interface Props {
  api: ApiPromise;
  core: number;
  timeslice: number;
  workload: CoreWorkloadType[]
  workplan?: CoreWorkplanType[] | null
}

function Workload({ api, core, timeslice, workload, workplan }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const [workloadData, setWorkloadData] = useState<InfoRow[]>();
  const [workplanData, setWorkplanData] = useState<InfoRow[]>();

  const regionInfo = useRegions(api);
  const region: RegionInfo | undefined = useMemo(() => regionInfo?.find((v) => v.core === core && v.start <= timeslice && v.end > timeslice), [regionInfo, core, timeslice]);

  useEffect(() => {
    if (!workload?.length) {
      return setWorkloadData([{ core }]);
    }

    setWorkloadData(formatRowInfo(workload, core, region, timeslice));
  }, [workload, region, timeslice, core]);

  useEffect(() => {
    setWorkplanData(formatRowInfo(workplan, core, region, timeslice));
  }
    , [workplan, region, timeslice, core]);

  const hasWorkplan = workplan?.length;

  return (
    <>
      {!!workloadData &&
        <tr
          className={`isExpanded isFirst ${isExpanded ? '' : 'isLast'}`}
          key={core}
        >
          {workloadData?.map((one) => {
            return (
              <React.Fragment key={one.owner + one.core}>
                <WorkInfoRow data={one} />
                <td style={{ paddingRight: '2rem', textAlign: 'right', verticalAlign: 'top' }}>
                  <h5 style={{ opacity: '0.6' }}>Workplan {workplan?.length ? `(${workplan?.length})` : ''}</h5>
                  {!!hasWorkplan &&
                    (
                      <ExpandButton
                        expanded={isExpanded}
                        onClick={toggleIsExpanded}
                      />
                    )
                  }
                  {!hasWorkplan && 'none'}
                </td>
              </React.Fragment>
            );
          })}

        </tr>
      }
      {isExpanded &&
        <>
          <tr>
            <td style={{ fontWeight: 700, paddingTop: '2rem', width: 150 }}>workplans</td>
            <td colSpan={7}></td>
          </tr>
          {workplanData?.map((workplanInfo) => (
            <Workplan
              currentTimeSlice={timeslice}
              isExpanded={isExpanded}
              key={workplanInfo.core}
              region={region}
              workplanData={workplanInfo}
            />
          ))}

        </>
      }
    </>
  );
}

export default React.memo(Workload);
