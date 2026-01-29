// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { PalletBrokerConfigRecord, RegionInfo } from '@polkadot/react-hooks/types';
import type { CoreWorkloadType, CoreWorkplanType, InfoRow } from '../types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { ExpandButton } from '@polkadot/react-components';
import { useRegions, useToggle } from '@polkadot/react-hooks';
import { useCoretimeConsts } from '@polkadot/react-hooks/useCoretimeConsts';

import { useBrokerContext } from '../BrokerContext.js';
import { estimateTime, formatRowInfo } from '../utils.js';
import WorkInfoRow from './WorkInfoRow.js';
import Workplan from './Workplan.js';

interface Props {
  api: ApiPromise;
  core: number;
  workload: CoreWorkloadType[] | undefined
  workplan?: CoreWorkplanType[] | undefined
  config: PalletBrokerConfigRecord
}

function Workload ({ api, config, core, workload, workplan }: Props): React.ReactElement<Props> {
  const coretimeConstants = useCoretimeConsts();

  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const [workloadData, setWorkloadData] = useState<InfoRow[]>();
  const [workplanData, setWorkplanData] = useState<InfoRow[]>();

  const { currentRegion, status } = useBrokerContext();

  const currentTimeSlice = useMemo(() =>
    status?.lastTimeslice ?? 0
  , [status]);

  const regionInfo = useRegions(api);
  const regionOwnerInfo: RegionInfo | undefined = useMemo(() => regionInfo?.find((v) => v.core === core && v.start <= currentTimeSlice && v.end > currentTimeSlice), [regionInfo, core, currentTimeSlice]);

  useEffect(() => {
    if (!!workload?.length && currentTimeSlice > 0) {
      // saleInfo points to a regionEnd and regionBeing in the next cycle, but we want the start and end of the current cycle
      setWorkloadData(formatRowInfo(
        workload,
        core,
        regionOwnerInfo,
        currentTimeSlice,
        {
          begin: currentRegion.begin || 0,
          beginDate: currentRegion.beginDate || '',
          end: currentRegion.end || 0,
          endDate: currentRegion.endDate || ''
        },
        config.regionLength,
        coretimeConstants?.relay
      ));
    } else {
      return setWorkloadData([{ core }]);
    }
  }, [workload, regionOwnerInfo, currentTimeSlice, core, config, coretimeConstants, currentRegion]);

  useEffect(() => {
    if (workplan?.length && status && coretimeConstants && currentRegion.endDate) {
      const futureRegionStart = currentRegion.end || 0;
      const futureRegionEnd = futureRegionStart + config.regionLength;
      const lastBlock = status.lastTimeslice * coretimeConstants?.relay.blocksPerTimeslice;

      setWorkplanData(formatRowInfo(
        workplan,
        core,
        regionOwnerInfo,
        status.lastTimeslice,
        {
          begin: futureRegionStart,
          beginDate: currentRegion.endDate,
          end: futureRegionEnd,
          endDate: estimateTime(futureRegionEnd, lastBlock)?.formattedDate ?? ''
        },
        config.regionLength,
        coretimeConstants?.relay
      ));
    }
  }, [workplan, regionOwnerInfo, status, core, config, coretimeConstants, currentRegion]);

  const hasWorkplan = workplan?.length;

  return (
    <>
      {!!workloadData &&
        <tr
          className={`isExpanded isFirst ${isExpanded ? '' : 'isLast'}`}
          key={core}
        >
          {workloadData.map((one) => {
            return (
              <React.Fragment key={`${one.endBlock}${one.core}`}>
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
            <td colSpan={8}></td>
          </tr>
          {workplanData?.map((workplanInfo) => (
            <Workplan
              isExpanded={isExpanded}
              key={workplanInfo.core}
              workplanData={workplanInfo}
            />
          ))}

        </>
      }
    </>
  );
}

export default React.memo(Workload);
