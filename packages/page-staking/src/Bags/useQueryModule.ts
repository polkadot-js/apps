// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AugmentedQueries } from '@polkadot/api-base/types';

import { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';

function useModuleImpl (): AugmentedQueries<'promise'>['bagsList'] {
  const { api } = useApi();

  return useMemo(
    () => api.query.bagsList || api.query.voterList,
    [api]
  );
}

export default createNamedHook('useQueryModule', useModuleImpl);
