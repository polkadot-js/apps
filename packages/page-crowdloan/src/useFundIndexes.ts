// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FundIndex } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { useApi, useEventTrigger } from '@polkadot/react-hooks';

export default function useFundIndexes (): FundIndex[] {
  const { api } = useApi();
  const [indexes, setIndexes] = useState<FundIndex[]>([]);
  const trigger = useEventTrigger([api.events.crowdloan.Created]);

  useEffect((): void => {
    trigger &&
      api.query.crowdloan.funds
        .keys()
        .then((indexes) => setIndexes(indexes.map(({ args }) => args[0] as FundIndex)))
        .catch(console.error);
  }, [api, trigger]);

  return indexes;
}
