// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { Nominations } from '@polkadot/types/interfaces';
import type { NominatedByMap } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function extractNominators (nominations: [StorageKey, Option<Nominations>][]): NominatedByMap {
  const mapped: NominatedByMap = {};

  for (let i = 0, nomCount = nominations.length; i < nomCount; i++) {
    const [key, optNoms] = nominations[i];

    if (optNoms.isSome && key.args.length) {
      const nominatorId = key.args[0].toString();
      const { submittedIn, targets } = optNoms.unwrap();

      for (let j = 0, tarCount = targets.length; j < tarCount; j++) {
        const validatorId = targets[j].toString();

        if (!mapped[validatorId]) {
          mapped[validatorId] = [];
        }

        mapped[validatorId].push({ index: j + 1, nominatorId, submittedIn });
      }
    }
  }

  return mapped;
}

function useNominationsImpl (isActive = true): NominatedByMap | undefined {
  const { api } = useApi();
  const nominators = useCall<[StorageKey, Option<Nominations>][]>(isActive && api.query.staking.nominators.entries);

  return useMemo(
    () => nominators && extractNominators(nominators),
    [nominators]
  );
}

export default createNamedHook('useNominations', useNominationsImpl);
