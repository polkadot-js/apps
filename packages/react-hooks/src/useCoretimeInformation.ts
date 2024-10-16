// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ParaId } from '@polkadot/types/interfaces';
import { CoreWorkload, CoreWorkloadInfo, type CoretimeInformation } from './types.js';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useApi, useBrokerConfig, useBrokerLeases, useBrokerReservations, useBrokerSalesInfo, useBrokerStatus, useCall, useCoreDescriptor, useRegions, useWorkloadInfos, useWorkplanInfos } from '@polkadot/react-hooks';

import { useBrokerPotentialRenewals } from './useBrokerPotentialRenewals.js';

function useCoretimeInformationImpl (api: ApiPromise, ready: boolean): CoretimeInformation | undefined {
  const { apiCoretime, isApiReady } = useApi();

  const [workloadData, setWorkloadData] = useState<CoreWorkload[]>([])

  /** coretime API calls */
  const status = useBrokerStatus(apiCoretime, isApiReady);
  const leases = useBrokerLeases(apiCoretime, isApiReady);
  const reservations = useBrokerReservations(apiCoretime, isApiReady);
  const salesInfo = useBrokerSalesInfo(apiCoretime, isApiReady);
  let workloads = useWorkloadInfos(apiCoretime, isApiReady);
  const workplans = useWorkplanInfos(apiCoretime, isApiReady);
  const config = useBrokerConfig(apiCoretime, isApiReady);
  const potentialRenewals = useBrokerPotentialRenewals(apiCoretime, isApiReady);
  const region = useRegions(apiCoretime);

  /** Other APIs */
  const paraIds = useCall<ParaId[]>(api.query.paras.parachains);
  const coreInfos = useCoreDescriptor(api, ready);

  const potentialRenewalsCurrentRegion = useMemo(() => potentialRenewals?.filter((renewal) => renewal.when === salesInfo?.regionEnd), [potentialRenewals]);
  const [state, setState] = useState<any | undefined>();

  useEffect(() => {
    if(workloads?.length) {
      setWorkloadData(workloads)
    }
    if (!!coreInfos?.length && !workloads?.length) {
      const parsedCoreInfos = coreInfos?.map(coreInfo => ({
        core: -1,
        info: coreInfo.info.currentWork.assignments.map(assignment => (
            {
              isPool: assignment.isPool,
              isTask: assignment.isTask,
              task: assignment.task,
              mask: [],
              maskBits: 0
            }
          ) as CoreWorkloadInfo)
      }))
      setWorkloadData(parsedCoreInfos)
    }

  }, [workloads, coreInfos])

  useEffect((): void => {
    if (!workloadData?.length || !leases?.length || !reservations?.length) {
      return;
    }

    const chainInfo: Record<string, any> = {};

    paraIds?.forEach((id: ParaId) => {
      const lease = leases?.find((lease) => lease.task === id.toString());
      const reservation = reservations?.find((reservation) => reservation.task === id.toString());
      const workload = workloadData?.find((one) => one.info.task === id.toString());

      chainInfo[id.toString()] = {
        id: id.toNumber(),
        lease,
        reservation,
        workload: workloadData,
        renewal: potentialRenewalsCurrentRegion?.find((renewal) => renewal.task.toString() === id.toString()),
        renewed: workplans?.find((workplan) => workplan.core === workload?.core && workplan.info.task.toString() === id.toString())
      };
    });

    if (chainInfo) {
      setState({
        chainInfo,
        salesInfo,
        status,
        region,
        config
      });
    }
  }, [paraIds, workloadData, potentialRenewalsCurrentRegion, salesInfo, leases, reservations, region, status]);

  return state;
}

export const useCoretimeInformation = createNamedHook('useCoretimeInformation', useCoretimeInformationImpl);
