// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { Nominations } from '@polkadot/types/interfaces';
import type { NominatedByMap } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function extractNominators (nominations: [StorageKey, Option<Nominations>][]): NominatedByMap {
  const mapped: NominatedByMap = {};

  for (let i = 0; i < nominations.length; i++) {
    const [key, optNoms] = nominations[i];

    if (optNoms.isSome && key.args.length) {
      const nominatorId = key.args[0].toString();
      const { submittedIn, targets } = optNoms.unwrap();

      for (let j = 0; j < targets.length; j++) {
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
  const nominators: [StorageKey, Option<Nominations>][] = useCall(isActive && api.query.staking.nominators.entries);

  return useMemo(
    () => nominators && extractNominators(nominators),
    [nominators]
  );
}

export default createNamedHook('useNominations', useNominationsImpl);
