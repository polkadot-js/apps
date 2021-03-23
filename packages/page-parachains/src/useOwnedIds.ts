// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { bool, Option } from '@polkadot/types';
import type { ParaId, ParaInfo } from '@polkadot/types/interfaces';
import type { OwnedId } from './types';

import { useEffect, useState } from 'react';

import { useAccounts, useApi, useEventTrigger } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

// Current Rococo returns a bool value for this entry
function isParaInfo (info: ParaInfo | bool): info is ParaInfo {
  return !isFunction((info as bool).isTrue);
}

export default function useOwnedIds (): OwnedId[] {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const trigger = useEventTrigger([api.events.registrar?.Registered]);
  const [state, setState] = useState<OwnedId[]>([]);

  useEffect((): void => {
    allAccounts && trigger &&
      api.query.registrar?.paras
        .entries<Option<ParaInfo | bool>, [ParaId]>()
        .then((entries) => setState(() =>
          entries
            .map(([{ args: [paraId] }, optInfo]): OwnedId | null => {
              if (!optInfo.isSome) {
                return null;
              }

              const paraInfo = optInfo.unwrap();

              return isParaInfo(paraInfo)
                ? {
                  manager: paraInfo.manager.toString(),
                  paraId,
                  paraInfo
                }
                : null;
            })
            .filter((info): info is OwnedId => !!info && allAccounts.some((a) => a === info.manager))
        ))
        .catch(console.error);
  }, [allAccounts, api, trigger]);

  return state;
}
