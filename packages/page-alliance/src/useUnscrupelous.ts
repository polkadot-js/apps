// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { Unscrupelous } from './types';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

function mapString (all: { toString: () => string }[]): string[] {
  return all.map((a) => a.toString());
}

const OPT_MULTI = {
  transform: ([accounts, websites]: [AccountId32[], Bytes[]]): Unscrupelous => ({
    accounts: mapString(accounts),
    websites: mapString(websites.filter((b) => b.isAscii))
  })
};

function useUnscrupelousImpl (): Unscrupelous | undefined {
  const { api } = useApi();

  return useCallMulti([
    api.query.alliance.unscrupulousAccounts,
    api.query.alliance.unscrupulousWebsites
  ], OPT_MULTI);
}

export default createNamedHook('useUnscrupelous', useUnscrupelousImpl);
