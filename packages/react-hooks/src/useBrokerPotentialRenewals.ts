// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option, StorageKey, u32 } from '@polkadot/types';
import type { PalletBrokerPotentialRenewalId, PalletBrokerPotentialRenewalRecord } from '@polkadot/types/lookup';
import type { PotentialRenewal } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall, useMapKeys } from '@polkadot/react-hooks';

import { processHexMask } from './utils/dataProcessing.js';

function extractInfo (info: Option<PalletBrokerPotentialRenewalRecord>, item: PalletBrokerPotentialRenewalId): PotentialRenewal {
  const unwrapped: PalletBrokerPotentialRenewalRecord | null = info.isSome ? info.unwrap() : null;
  let mask = [];
  let task = null;
  const completion = unwrapped?.completion;

  if (completion?.isComplete) {
    const complete = completion?.asComplete[0];

    task = complete.assignment.isTask ? complete?.assignment.asTask.toString() : complete?.assignment.isPool ? 'Pool' : 'Idle';
    mask = processHexMask(complete.mask);
  } else if (completion?.isPartial) {
    task = null;
    mask = completion.asPartial[0];
  } else {
    mask = [];
  }

  return {
    core: item?.core.toNumber(),
    when: item?.when.toNumber(),
    price: unwrapped?.price.toBn(),
    // How much of a core has been assigned or, if completely assigned, the workload itself.
    completion: completion?.type,
    mask,
    maskBits: mask?.length,
    task
  };
}

const OPT_KEY = {
  transform: (keys: StorageKey<[u32]>[]): u32[] =>
    keys.map(({ args: [id] }) => id)
};

function useBrokerPotentialRenewalsImpl (api: ApiPromise, ready: boolean): any | undefined {
  const keys = useMapKeys(ready && api.query.broker.potentialRenewals, [], OPT_KEY);
  const potentialRenewals = useCall<[[PalletBrokerPotentialRenewalId[]], Option<PalletBrokerPotentialRenewalRecord>[]]>(ready && api.query.broker.potentialRenewals.multi, [keys], { withParams: true });

  const [state, setState] = useState<any[] | undefined>();

  useEffect((): void => {
    potentialRenewals &&
      setState(potentialRenewals[0][0].map((info, index) => extractInfo(potentialRenewals[1][index], info))
      );
  }, [potentialRenewals]);

  return state;
}

export const useBrokerPotentialRenewals = createNamedHook('useBrokerPotentialRenewals', useBrokerPotentialRenewalsImpl);
