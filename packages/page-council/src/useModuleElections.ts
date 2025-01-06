// Copyright 2017-2025 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';

function useModuleElectionsImpl (): string | null {
  const { api } = useApi();

  return useMemo(
    () => api.tx.phragmenElection
      ? 'phragmenElection'
      : api.tx.electionsPhragmen
        ? 'electionsPhragmen'
        : api.tx.elections
          ? 'elections'
          : null,
    [api]
  );
}

export const useModuleElections = createNamedHook('useModuleElections', useModuleElectionsImpl);
