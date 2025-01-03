// Copyright 2017-2025 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { Unscrupulous } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function mapString (all: { toString: () => string }[]): string[] {
  return all.map((a) => a.toString());
}

const OPT_ACC = {
  transform: (accounts: AccountId32[]): string[] =>
    mapString(accounts)
};

const OPT_WEB = {
  transform: (websites: Bytes[]): string[] =>
    mapString(websites.filter((b) => b.isAscii))
};

function useUnscrupulousImpl (): Unscrupulous | undefined {
  const { api } = useApi();
  const accounts = useCall<string[]>(api.query.alliance.unscrupulousAccounts, [], OPT_ACC);
  const websites = useCall<string[]>(api.query.alliance.unscrupulousWebsites, [], OPT_WEB);

  return useMemo(
    () => accounts && websites && { accounts, websites },
    [accounts, websites]
  );
}

export default createNamedHook('useUnscrupulous', useUnscrupulousImpl);
