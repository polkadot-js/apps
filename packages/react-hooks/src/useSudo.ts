// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
import type { UseSudo } from './types';

import { useEffect, useState } from 'react';

import { useAccounts } from './useAccounts';
import { useApi } from './useApi';
import { useCall } from './useCall';

const transformSudo = {
  transform: (key: AccountId) => key.toString()
};

export function useSudo (): UseSudo {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const sudoKey = useCall<string>(hasAccounts && api.query.sudo?.key, undefined, transformSudo);
  const [hasSudoKey, setHasSudoKey] = useState(false);

  useEffect((): void => {
    setHasSudoKey(!!sudoKey && !!allAccounts && allAccounts.some((key) => key === sudoKey));
  }, [allAccounts, sudoKey]);

  return { allAccounts, hasSudoKey, sudoKey };
}
