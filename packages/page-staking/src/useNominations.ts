// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import type { Option, StorageKey } from '@polkadot/types';
import type { Nominations } from '@polkadot/types/interfaces';
import { useApi, useCall } from '@polkadot/react-hooks';

import type { NominatedBy } from './types';

type Result = Record<string, NominatedBy[]>;

function extractNominators (nominations: [StorageKey, Option<Nominations>][]): Result {
  return nominations.reduce((mapped: Result, [key, optNoms]) => {
    if (optNoms.isSome && key.args.length) {
      const nominatorId = key.args[0].toString();
      const { submittedIn, targets } = optNoms.unwrap();

      targets.forEach((_validatorId, index): void => {
        const validatorId = _validatorId.toString();
        const info = { index: index + 1, nominatorId, submittedIn };

        if (!mapped[validatorId]) {
          mapped[validatorId] = [info];
        } else {
          mapped[validatorId].push(info);
        }
      });
    }

    return mapped;
  }, {});
}

export default function useNominations (isActive = true): Result | undefined {
  const { api } = useApi();
  const nominators = useCall<[StorageKey, Option<Nominations>][]>(isActive && api.query.staking.nominators.entries);

  return useMemo(
    () => nominators && extractNominators(nominators),
    [nominators]
  );
}
