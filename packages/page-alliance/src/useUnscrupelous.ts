// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { Unscrupelous } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function getUnscrupelous (accounts: AccountId32[], websites: Bytes[]): Unscrupelous {
  return {
    accounts: accounts.map((a) => a.toString()),
    websites: websites.filter((b) => b.isAscii).map((b) => b.toString())
  };
}

function useUnscrupelousImpl (): Unscrupelous | undefined {
  const { api } = useApi();
  const accounts = useCall<AccountId32[]>(api.query.alliance.unscrupulousAccounts, []);
  const websites = useCall<Bytes[]>(api.query.alliance.unscrupulousWebsites, []);

  return useMemo(
    (): Unscrupelous | undefined =>
      accounts && websites &&
        getUnscrupelous(accounts, websites),
    [accounts, websites]
  );
}

export default createNamedHook('useUnscrupelous', useUnscrupelousImpl);
