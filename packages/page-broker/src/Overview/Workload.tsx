// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { PalletBrokerConfigRecord, RegionInfo } from '@polkadot/react-hooks/types';
import type { Option } from '@polkadot/types';
import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';
import type { CoreWorkloadType, CoreWorkplanType, InfoRow } from '../types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { ExpandButton } from '@polkadot/react-components';
import { useApi, useBrokerSalesInfo, useCall, useRegions, useToggle } from '@polkadot/react-hooks';
import { useCoretimeConsts } from '@polkadot/react-hooks/useCoretimeConsts';

import { formatRowInfo } from '../utils.js';
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
  const { isApiReady } = useApi();
  const salesInfo = useBrokerSalesInfo(api, isApiReady);
  const coretimeConstants = useCoretimeConsts();

  const status = useCall<Option<PalletBrokerStatusRecord>>(isApiReady && api.query.broker?.status);
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const [workloadData, setWorkloadData] = useState<InfoRow[]>();
  const [workplanData, setWorkplanData] = useState<InfoRow[]>();

  const currentTimeSlice = useMemo(() => {
    if (status?.isSome) {
      return status.unwrap().lastCommittedTimeslice.toNumber();
    }

    return 0;
  }, [status]);

  const regionInfo = useRegions(api);
  const region: RegionInfo | undefined = useMemo(() => regionInfo?.find((v) => v.core === core && v.start <= currentTimeSlice && v.end > currentTimeSlice), [regionInfo, core, currentTimeSlice]);

  useEffect(() => {
    if (!!workload?.length && !!salesInfo) {
      // saleInfo points to a regionEnd and regionBeing in the next cycle, but we want the start and end of the current cycle
      setWorkloadData(formatRowInfo(
        workload,
        core,
        region,
        currentTimeSlice,
        { regionBegin: salesInfo.regionBegin - config.regionLength, regionEnd: salesInfo.regionEnd - config.regionLength },
        config.regionLength,
        coretimeConstants?.relay
      ));
    } else {
      return setWorkloadData([{ core }]);
    }
  }, [workload, region, currentTimeSlice, core, salesInfo, config, coretimeConstants]);

  useEffect(() => {
    if (!!workplan?.length && !!salesInfo) {
      setWorkplanData(formatRowInfo(
        workplan,
        core,
        region,
        currentTimeSlice,
        { regionBegin: salesInfo.regionBegin - config.regionLength, regionEnd: salesInfo.regionEnd - config.regionLength },
        config.regionLength,
        coretimeConstants?.relay
      ));
    }
  }
  , [workplan, region, currentTimeSlice, core, salesInfo, config, coretimeConstants]);

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
            <td colSpan={7}></td>
          </tr>
          {workplanData?.map((workplanInfo) => (
            <Workplan
              currentTimeSlice={currentTimeSlice}
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
