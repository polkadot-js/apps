// Copyright 2017-2021 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { useApi } from '@polkadot/react-hooks';

export function useModuleElections (): string | null {
  const { api } = useApi();

  return useMemo(
    (): string | null =>
      api.tx.phragmenElection
        ? 'phragmenElection'
        : api.tx.electionsPhragmen
          ? 'electionsPhragmen'
          : api.tx.elections
            ? 'elections'
            : null,
    [api]
  );
}
