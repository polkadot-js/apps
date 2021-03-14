// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { ParaId, ParaLifecycle } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { useApi, useEventTrigger } from '@polkadot/react-hooks';

export default function useUpomingIds (): ParaId[] | undefined {
  const { api } = useApi();
  const trigger = useEventTrigger([api.events.session.NewSession, api.events.registrar?.Registered]);
  const [result, setResult] = useState<ParaId[] | undefined>();

  useEffect((): void => {
    trigger &&
      api.query.paras.paraLifecycles
        .entries<Option<ParaLifecycle>, [ParaId]>()
        .then((entries) => setResult(() =>
          entries
            .map(([{ args: [paraId] }, optValue]): ParaId | null => {
              const value = optValue.unwrap();

              return value && (
                value.isParathread ||
                value.isUpgradingToParachain ||
                value.isOutgoingParathread ||
                value.isOnboarding
              )
                ? paraId
                : null;
            })
            .filter((paraId): paraId is ParaId => !!paraId)
            .sort((a, b) => a.cmp(b))
        ))
        .catch(console.error);
  }, [api, trigger]);

  return result;
}
