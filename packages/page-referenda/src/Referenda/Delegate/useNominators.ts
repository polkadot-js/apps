// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletStakingNominations } from '@polkadot/types/lookup';

import { useMemo } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

const NOMINATORS_OPT = {
  transform: (optNominators: Option<PalletStakingNominations>[]): string[] =>
    optNominators.reduce<string[]>((all, o) =>
      o.isSome
        ? all.concat(
          o.unwrap().targets
            .map((w) => w.toString())
            .filter((w) => !all.includes(w))
        )
        : all, []
    )
};

// A list of all validators that any of our accounts nominate
// (deduped across accounts)
function useNominatorsImpl (): string[] | null | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();

  const nomineesParam = useMemo(
    () => [allAccounts],
    [allAccounts]
  );

  const nominees = useCall(!!allAccounts.length && nomineesParam && api.query.staking?.nominators?.multi, nomineesParam, NOMINATORS_OPT);

  return useMemo(
    () => isFunction(api.query.staking?.nominators) && allAccounts.length
      ? nominees
      : [],
    [allAccounts, api, nominees]
  );
}

export default createNamedHook('useNominators', useNominatorsImpl);
