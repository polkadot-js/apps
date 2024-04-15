// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { OnDemandQueueStatus } from './types.js';

function extractInfo(value: OnDemandQueueStatus) {

    return {
        traffic: value.traffic,
        nextIndex: value.nextIndex,
        smallestIndex: value.smallestIndex,
        freedIndices: value.freedIndices,
    };
}

function useQueueStatusImpl(): OnDemandQueueStatus | undefined {
    const { api } = useApi();

    const queue = useCall<OnDemandQueueStatus>(api.query.onDemandAssignmentProvider.queueStatus);

    const [state, setState] = useState<OnDemandQueueStatus | undefined>();

    useEffect((): void => {
        queue &&
            setState(
                extractInfo(queue)
            );
    }, [queue]);

    return state;
}

export default createNamedHook('useQueueStatus', useQueueStatusImpl);
