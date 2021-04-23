// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetId } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { useApi, useEventTrigger } from '@polkadot/react-hooks';

export default function useAssetIds (): AssetId[] | undefined {
  const { api } = useApi();
  const trigger = useEventTrigger([api.events.assets.Created, api.events.assets.Destroyed]);
  const [state, setState] = useState<AssetId[] | undefined>();

  useEffect((): void => {
    trigger &&
      api.query.assets.asset
        .keys()
        .then((keys) => setState(
          keys
            .map(({ args: [assetId] }) => assetId)
            .sort((a, b) => a.cmp(b))
        ))
        .catch(console.error);
  }, [api, trigger]);

  return state;
}
