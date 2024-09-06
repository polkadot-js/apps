// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Vec } from '@polkadot/types';
import type { PalletBrokerScheduleItem } from '@polkadot/types/lookup';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall } from '@polkadot/react-hooks';

import { processHexMask } from './utils/dataProcessing.js';

interface Reservation {
  assignment: string
  core: number,
  mask: number,
}

function useBrokerReservationsImpl (api: ApiPromise, ready: boolean): Reservation[] | undefined {
  const reservations = useCall<[any, Vec<Vec<PalletBrokerScheduleItem>>[]]>(ready && api.query.broker.reservations);
  const [state, setState] = useState<Reservation[]>();

  useEffect((): void => {
    if (!reservations) {
      return;
    }

    setState(
      reservations.map((info: PalletBrokerScheduleItem[], index: number) => {
        return {
          assignment: info[0]?.assignment?.isTask ? info[0]?.assignment?.asTask.toString() : info[0]?.assignment?.isPool ? 'Pool' : '',
          core: index,
          mask: processHexMask(info[0]?.mask)?.length ?? 0,
        };
      }
      ));
  }, [reservations]);

  return state;
}

export const useBrokerReservations = createNamedHook('useBrokerReservations', useBrokerReservationsImpl);
