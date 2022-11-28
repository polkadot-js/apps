// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveContributions, DeriveOwnContributions } from '@polkadot/api-derive/types';
import type { Balance, ParaId } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { encodeAddress } from '@polkadot/util-crypto';

interface Result extends DeriveContributions {
  hasLoaded: boolean;
  myAccounts: string[];
  myAccountsHex: string[];
  myContributions: Record<string, Balance>;
}

const NO_CONTRIB: Result = {
  blockHash: '-',
  contributorsHex: [],
  hasLoaded: false,
  myAccounts: [],
  myAccountsHex: [],
  myContributions: {}
};

function useContributionsImpl (paraId: ParaId): Result {
  const { api } = useApi();
  const { allAccountsHex } = useAccounts();
  const [state, setState] = useState<Result>(() => NO_CONTRIB);
  const derive = useCall<DeriveContributions>(api.derive.crowdloan.contributions, [paraId]);
  const myContributions = useCall<DeriveOwnContributions>(api.derive.crowdloan.ownContributions, [paraId, state.myAccountsHex]);

  useEffect((): void => {
    derive && setState((prev): Result => {
      let myAccountsHex = derive.contributorsHex.filter((h) => allAccountsHex.includes(h));
      let myAccounts: string[];

      if (myAccountsHex.length === prev.myAccountsHex.length) {
        myAccountsHex = prev.myAccountsHex;
        myAccounts = prev.myAccounts;
      } else {
        myAccounts = myAccountsHex.map((a) => encodeAddress(a, api.registry.chainSS58));
      }

      return { ...prev, ...derive, hasLoaded: true, myAccounts, myAccountsHex };
    });
  }, [api, allAccountsHex, derive]);

  useEffect((): void => {
    myContributions && setState((prev) => ({
      ...prev,
      myContributions
    }));
  }, [myContributions]);

  return state;
}

export default createNamedHook('useContributions', useContributionsImpl);
