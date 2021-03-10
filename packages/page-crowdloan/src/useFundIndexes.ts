// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { useApi, useEventTrigger } from '@polkadot/react-hooks';

export default function useFundIndexes (): ParaId[] {
  const { api } = useApi();
  const [indexes, setIndexes] = useState<ParaId[]>([]);
  const trigger = useEventTrigger([api.events.crowdloan.Created]);

  useEffect((): void => {
    trigger &&
      api.query.crowdloan.funds
        .keys()
        .then((indexes) => setIndexes(indexes.map(({ args }) => args[0] as ParaId)))
        .catch(console.error);
  }, [api, trigger]);

  return indexes;
}
