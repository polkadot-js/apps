// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ParaId } from '@polkadot/types/interfaces';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useApi, useBrokerConfig, useBrokerLeases, useBrokerReservations, useBrokerSalesInfo, useBrokerStatus, useCall, useRegions, useWorkloadInfos, useWorkplanInfos } from '@polkadot/react-hooks';
import { CoretimeInformation } from './types.js';
import { useBrokerPotentialRenewals } from './useBrokerPotentialRenewals.js';


function useCoretimeInformationImpl(api: ApiPromise, ready: boolean): CoretimeInformation | undefined {

    const { apiCoretime, isApiReady } = useApi();
    if (!apiCoretime || !apiCoretime?.query) {
        return
    }
    const status = useBrokerStatus(apiCoretime, isApiReady)
    const leases = useBrokerLeases(apiCoretime, ready)
    const reservations = useBrokerReservations(apiCoretime, ready)
    const salesInfo = useBrokerSalesInfo(apiCoretime, ready)
    const paraIds = useCall<ParaId[]>(api.query.paras.parachains);
    const workloads = useWorkloadInfos(apiCoretime, ready)
    const workplans = useWorkplanInfos(apiCoretime, ready)
    const config = useBrokerConfig(apiCoretime, ready)
    const region = useRegions(apiCoretime)
    const potentialRenewals = useBrokerPotentialRenewals(apiCoretime, ready)

    const potentialRenewalsCurrentRegion = useMemo(() => potentialRenewals?.filter(renewal => renewal.when === salesInfo?.regionEnd), [potentialRenewals])

    console.log('potent ', potentialRenewals)

    const [state, setState] = useState<any | undefined>();

    console.log(potentialRenewals)

    useEffect((): void => {
        if(!workloads?.length || !leases?.length || !reservations?.length) {
            return
        }
        let chainInfo: Record<string, any> = {};
        paraIds?.forEach((id: ParaId) => {
            const lease = leases?.find( lease => lease.task === id.toString())
            const reservation = reservations?.find( reservation => reservation.task === id.toString())
            const workload = workloads?.find(one => one.info.task === id.toString())
            chainInfo[id.toString()] = {
                id: id.toNumber(),
                lease,
                reservation,
                workload,
                renewal: potentialRenewalsCurrentRegion?.find(renewal => renewal.task.toString() === id.toString()),
                renewed: workplans?.find(workplan => workplan.core === workload?.core && workplan.info.task.toString() === id.toString())
            }
            
        })

        if (chainInfo) {
            setState({
                chainInfo,
                salesInfo,
                status,
                region,
                config,
            })
        }
    }, [paraIds, workloads, potentialRenewalsCurrentRegion, salesInfo, leases, reservations, region, status]);

    return state;
}

export const useCoretimeInformation = createNamedHook('useCoretimeInformation', useCoretimeInformationImpl);
