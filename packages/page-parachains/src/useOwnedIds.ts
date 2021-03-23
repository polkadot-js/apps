// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { ParaId, ParaInfo } from '@polkadot/types/interfaces';
import type { OwnedId } from './types';

import { useEffect, useState } from 'react';

import { useAccounts, useApi, useEventTrigger } from '@polkadot/react-hooks';

export default function useOwnedIds (): OwnedId[] {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const trigger = useEventTrigger([api.events.registrar?.Registered]);
  const [state, setState] = useState<OwnedId[]>([]);

  useEffect((): void => {
    allAccounts && trigger &&
      api.query.registrar?.paras
        .entries<Option<ParaInfo>, [ParaId]>()
        .then((entries) => setState(() =>
          entries
            .filter(([, optInfo]) => optInfo.isSome)
            .map(([{ args: [paraId] }, optInfo]): OwnedId => {
              const paraInfo = optInfo.unwrap();

              return {
                manager: paraInfo.manager.toString(),
                paraId,
                paraInfo
              };
            })
            .filter(({ manager }) => allAccounts.some((a) => a === manager))
        ))
        .catch(console.error);
  }, [allAccounts, api, trigger]);

  return state;
}
