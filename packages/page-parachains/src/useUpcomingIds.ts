// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { ParaId } from '@polkadot/types/interfaces';
import type { PolkadotRuntimeParachainsParasParaLifecycle } from '@polkadot/types/lookup';

import { createNamedHook, useApi, useEventTrigger, useMapEntries } from '@polkadot/react-hooks';

const OPT_ENTRIES = {
  transform: (entries: [StorageKey<[ParaId]>, Option<PolkadotRuntimeParachainsParasParaLifecycle>][]): ParaId[] =>
    entries
      .map(([{ args: [paraId] }, optValue]): ParaId | null => {
        const value = optValue.unwrapOr(null);

        return value && (
          value.isParathread ||
          value.isUpgradingParathread ||
          value.isOffboardingParathread ||
          value.isOnboarding
        )
          ? paraId
          : null;
      })
      .filter((paraId): paraId is ParaId => !!paraId)
      .sort((a, b) => a.cmp(b))
};

function useUpomingIdsImpl (): ParaId[] | undefined {
  const { api } = useApi();
  const trigger = useEventTrigger([
    api.events.session.NewSession,
    api.events.registrar.Registered
  ]);

  return useMapEntries(api.query.paras.paraLifecycles, [], OPT_ENTRIES, trigger.blockHash);
}

export default createNamedHook('useUpomingIds', useUpomingIdsImpl);
