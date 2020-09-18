// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId } from '@polkadot/types/interfaces';
import { UseSudo } from './types';

import { useEffect, useState } from 'react';

import useAccounts from './useAccounts';
import useApi from './useApi';
import useCall from './useCall';

const transformSudo = {
  transform: (key: AccountId) => key.toString()
};

export default function useSudo (): UseSudo {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const sudoKey = useCall<string>(hasAccounts && api.query.sudo?.key, undefined, transformSudo);
  const [isMine, setIsMine] = useState(false);

  useEffect((): void => {
    setIsMine(!!sudoKey && !!allAccounts && allAccounts.some((key) => key === sudoKey));
  }, [allAccounts, sudoKey]);

  return { allAccounts, isMine, sudoKey };
}
