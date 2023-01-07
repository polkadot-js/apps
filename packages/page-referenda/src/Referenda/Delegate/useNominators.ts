// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletStakingNominations } from '@polkadot/types/lookup';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

const NOMINATORS_OPT = {
  transform: (optNominators: Option<PalletStakingNominations>): string[] =>
    optNominators.isSome
      ? optNominators.unwrap().targets.map((w) => w.toString())
      : []
};

function useNominatorsImpl (accountId?: string | null): string[] | null | undefined {
  const { api } = useApi();
  const nomineesParam = useMemo(
    () => (accountId && [accountId]) || null,
    [accountId]
  );
  const nominees = useCall(nomineesParam && api.query.staking?.nominators, nomineesParam, NOMINATORS_OPT);

  return useMemo(
    () => isFunction(api.query.staking?.nominators)
      ? nomineesParam && nominees
      : [],
    [api, nominees, nomineesParam]
  );
}

export default createNamedHook('useNominators', useNominatorsImpl);
