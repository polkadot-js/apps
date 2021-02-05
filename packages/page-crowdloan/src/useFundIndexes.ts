// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EventRecord, FundIndex } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

const filterEvents = {
  transform: (records: EventRecord[]): number =>
    records.filter(({ event, phase }) => event && phase?.isApplyExtrinsic && event.section === 'crowdloan' && ['Created'].includes(event.method)).length
};

export default function useFundIndexes (): FundIndex[] {
  const { api } = useApi();
  const [indexes, setIndexes] = useState<FundIndex[]>([]);
  const [trigger, setTrigger] = useState(() => Date.now());
  const eventsCount = useCall<number>(api.query.system.events, undefined, filterEvents);

  useEffect((): void => {
    eventsCount && setTrigger(Date.now());
  }, [eventsCount]);

  useEffect((): void => {
    trigger && api.query.crowdloan.funds
      .keys()
      .then((indexes) => setIndexes(indexes.map(({ args }) => args[0] as FundIndex)));
  }, [api, trigger]);

  return indexes;
}
