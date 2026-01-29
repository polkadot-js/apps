// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
import type { UseSudo } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook } from './createNamedHook.js';
import { useAccounts } from './useAccounts.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

const OPT = {
  transform: (key: AccountId) => key.toString()
};

function useSudoImpl (): UseSudo {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const sudoKey = useCall<string>(hasAccounts && api.query.sudo?.key, undefined, OPT);
  const [hasSudoKey, setHasSudoKey] = useState(false);

  useEffect((): void => {
    setHasSudoKey(!!sudoKey && !!allAccounts && allAccounts.some((key) => key === sudoKey));
  }, [allAccounts, sudoKey]);

  return { allAccounts, hasSudoKey, sudoKey };
}

export const useSudo = createNamedHook('useSudo', useSudoImpl);
