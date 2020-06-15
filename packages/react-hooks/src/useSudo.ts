// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Codec } from '@polkadot/types/types';
import { UseSudo } from './types';

import { useEffect, useState } from 'react';

import useAccounts from './useAccounts';
import useApi from './useApi';
import useCall from './useCall';

export default function useSudo (): UseSudo {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const sudoKey = useCall<string>(hasAccounts && api.query.sudo?.key, [], {
    transform: (k: Codec) => k.toString()
  });
  const [isMine, setIsMine] = useState(false);

  useEffect((): void => {
    setIsMine(!!sudoKey && !!allAccounts && allAccounts.some((key) => key === sudoKey));
  }, [allAccounts, sudoKey]);

  return { allAccounts, isMine, sudoKey };
}
