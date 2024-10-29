// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ChainInformation, CoretimeInformation, CoreWorkload, CoreWorkloadInfo, LegacyLease, PotentialRenewal, Reservation } from './types.js';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useApi, useBrokerConfig, useBrokerLeases, useBrokerReservations, useBrokerSalesInfo, useBrokerStatus, useCoreDescriptor, useRegions, useWorkloadInfos, useWorkplanInfos } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

import { ChainRenewalStatus, CoreTimeChainConsts, CoreTimeTypes } from './types.js';
import { useBrokerPotentialRenewals } from './useBrokerPotentialRenewals.js';

const getOccupancyType = (lease: LegacyLease | undefined, reservation: Reservation | undefined, isPool: boolean): CoreTimeTypes => {
  if (isPool) {
    return CoreTimeTypes['On Demand'];
  }

  return reservation ? CoreTimeTypes.Reservation : lease ? CoreTimeTypes.Lease : CoreTimeTypes['Bulk Coretime'];
};

function useCoretimeInformationImpl (api: ApiPromise, ready: boolean): CoretimeInformation | undefined {
  const { apiCoretime, isApiReady } = useApi();

  const [workloadData, setWorkloadData] = useState<CoreWorkload[]>([]);
  const [taskIds, setTaskIds] = useState<number[]>([]);

  /** coretime API calls */
  const status = useBrokerStatus(apiCoretime, isApiReady);
  const leases = useBrokerLeases(apiCoretime, isApiReady);
  const reservations = useBrokerReservations(apiCoretime, isApiReady);
  const salesInfo = useBrokerSalesInfo(apiCoretime, isApiReady);
  const workloads = useWorkloadInfos(apiCoretime, isApiReady);
  const workplans = useWorkplanInfos(apiCoretime, isApiReady);
  const config = useBrokerConfig(apiCoretime, isApiReady);
  const potentialRenewals = useBrokerPotentialRenewals(apiCoretime, isApiReady);
  const region = useRegions(apiCoretime);

  /** Other APIs */
  const coreInfos = useCoreDescriptor(api, ready);
  const paraIds = useMemo(() => coreInfos && [...new Set(coreInfos?.map((a) => a.info.currentWork.assignments.map((ass) => ass.task)).flat().filter((id) => id !== 'Pool'))], [coreInfos]);

  const isInterludePhase = useMemo(() => {
    if (!salesInfo || !config || !status) {
      return false;
    }

    const currentRegionStart = new BN(salesInfo?.regionBegin).sub(new BN(config.regionLength));
    const interludeLengthTs = new BN(config?.interludeLength).div(new BN(CoreTimeChainConsts.BlocksPerTimeslice));
    const interludeEndTs = currentRegionStart.add(interludeLengthTs);

    return interludeEndTs.gte(new BN(status?.lastCommittedTimeslice));
  }, [status, salesInfo, config]);

  const potentialRenewalsCurrentRegion = useMemo(() => {
    if (!isInterludePhase || !config || !salesInfo) {
      return [];
    }

    // when - The point in time that the renewable workload on core ends and a fresh renewal may begin.
    return potentialRenewals?.filter((renewal: PotentialRenewal) => renewal.when.toString() === salesInfo?.regionBegin.toString());
  }, [potentialRenewals, salesInfo, config, isInterludePhase]);

  const [state, setState] = useState<CoretimeInformation | undefined>();

  useEffect(() => {
    if (paraIds?.length && potentialRenewals?.length && !taskIds.length) {
      const simpleIds = paraIds.map((p) => Number(p));
      const renewalIds = potentialRenewals?.map((r) => Number(r.task));
      const numbers = [...new Set(simpleIds.concat(renewalIds))];

      if (numbers?.length > simpleIds.length) {
        setTaskIds(numbers.sort((a, b) => a - b));
      } else {
        setTaskIds(simpleIds);
      }
    }
  }, [potentialRenewals, paraIds, taskIds]);

  useEffect(() => {
    if (workloads?.length) {
      setWorkloadData(workloads);
    }

    if (!!coreInfos?.length && !workloads?.length) {
      const parsedCoreInfos = coreInfos?.map((coreInfo) => ({
        core: -1,
        info: coreInfo.info.currentWork.assignments.map((assignment) => (
          {
            isPool: assignment.isPool,
            isTask: assignment.isTask,
            mask: [],
            maskBits: 0,
            task: assignment.task
          }
        ) as CoreWorkloadInfo)
      }));

      setWorkloadData(parsedCoreInfos as unknown as CoreWorkload[]);
    }
  }, [workloads, coreInfos]);

  useEffect((): void => {
    if (!workloadData?.length || !leases?.length || !reservations?.length) {
      return;
    }

    const chainInfo: Record<string, ChainInformation> = {};

    taskIds?.forEach((id) => {
      const taskId = id.toString();
      const lease = leases?.find((lease) => lease.task === taskId);
      const reservation = reservations?.find((reservation) => reservation.task === taskId);
      const workloads = workloadData?.filter((one) => one.info.task === taskId);

      const workTaskInfo = workloads.map((workload) => {
        const workplan = workplans?.filter((workplan) => workplan.core === workload?.core && workplan.info.task.toString() === taskId);
        const type = getOccupancyType(lease, reservation, workload?.info.isPool ?? false);
        const chainRenewedCore = type === CoreTimeTypes['Bulk Coretime'] && workplan?.find((a) => a.core === workload?.core);
        const renewal = potentialRenewalsCurrentRegion?.find((renewal) => renewal.task.toString() === taskId);
        const renewalStatus = chainRenewedCore ? ChainRenewalStatus.Renewed : renewal ? ChainRenewalStatus.Eligible : ChainRenewalStatus.None;

        return {
          chainRenewedCore,
          renewal,
          renewalStatus,
          type,
          workload,
          workplan
        };
      });

      chainInfo[id.toString()] = {
        id,
        lease,
        reservation,
        workTaskInfo
      };
    });

    if (chainInfo && config && region && salesInfo && status) {
      setState({
        chainInfo,
        config,
        region,
        salesInfo,
        status,
        taskIds
      });
    }
  }, [taskIds, workloadData, potentialRenewalsCurrentRegion, salesInfo, leases, reservations, region, status, config, workplans]);

  return state;
}

export const useCoretimeInformation = createNamedHook('useCoretimeInformation', useCoretimeInformationImpl);
