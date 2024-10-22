// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ParaId } from '@polkadot/types/interfaces';
import type { ChainInformation, CoretimeInformation, CoreWorkload, CoreWorkloadInfo, PotentialRenewal } from './types.js';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useApi, useBrokerConfig, useBrokerLeases, useBrokerReservations, useBrokerSalesInfo, useBrokerStatus, useCall, useCoreDescriptor, useRegions, useWorkloadInfos, useWorkplanInfos } from '@polkadot/react-hooks';

import { useBrokerPotentialRenewals } from './useBrokerPotentialRenewals.js';

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
  const paraIds = useCall<ParaId[]>(api.query.paras.parachains);
  const coreInfos = useCoreDescriptor(api, ready);
  // when - The point in time that the renewable workload on core ends and a fresh renewal may begin.
  const potentialRenewalsCurrentRegion = useMemo(() => config && salesInfo && potentialRenewals?.filter((renewal: PotentialRenewal) => renewal.when.toString() === salesInfo?.regionBegin.toString()), [potentialRenewals, salesInfo, config]);
  const [state, setState] = useState<CoretimeInformation | undefined>();

  useEffect(() => {
    if (paraIds?.length && potentialRenewals?.length && !taskIds.length) {
      const simpleIds = paraIds.map((p) => p.toNumber());
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
      const workload = workloadData?.find((one) => one.info.task === taskId);
      const renewal = potentialRenewalsCurrentRegion?.find((renewal) => renewal.task.toString() === taskId);
      const worklplan = workplans?.filter((workplan) => workplan.core === workload?.core && workplan.info.task.toString() === taskId);

      chainInfo[id.toString()] = {
        id,
        lease,
        renewal,
        reservation,
        workload,
        worklplan
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
