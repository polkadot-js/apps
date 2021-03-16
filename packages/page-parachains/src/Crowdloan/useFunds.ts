// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BlockNumber, FundInfo, ParaId } from '@polkadot/types/interfaces';
import type { Campaign } from './types';

import BN from 'bn.js';
import { useEffect, useMemo, useState } from 'react';

import { useApi, useBestNumber, useCallMulti, useEventTrigger } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

interface Result {
  activeCap: BN;
  activeRaised: BN;
  funds: Campaign[] | null;
  totalCap: BN;
  totalRaised: BN;
}

const EMPTY: Result = {
  activeCap: BN_ZERO,
  activeRaised: BN_ZERO,
  funds: null,
  totalCap: BN_ZERO,
  totalRaised: BN_ZERO
};

// extract fund info from the available paraIds
function extractCampaigns (optFunds: Option<FundInfo>[], paraIds: ParaId[]): Campaign[] | null {
  return optFunds && paraIds.length === optFunds.length
    ? paraIds
      .map((paraId, i) => ({ info: optFunds[i].unwrapOr(null), paraId }))
      .filter((fund): fund is Campaign => !!fund.info)
    : null;
}

// compare the current campaigns against the previous, manually adding ending and calculating the new totals
function createResult (bestNumber: BlockNumber, funds: Campaign[], prev: Result): Result {
  const [activeRaised, activeCap, totalRaised, totalCap] = funds.reduce(([ar, ac, tr, tc], { info: { cap, end, raised } }) => [
    bestNumber.gt(end) ? ar : ar.iadd(raised),
    bestNumber.gt(end) ? ac : ac.iadd(cap),
    tr.iadd(raised),
    tc.iadd(cap)
  ], [new BN(0), new BN(0), new BN(0), new BN(0)]);
  const hasNewActiveCap = !prev.activeCap.eq(activeCap);
  const hasNewActiveRaised = !prev.activeRaised.eq(activeRaised);
  const hasNewTotalCap = !prev.totalCap.eq(totalCap);
  const hasNewTotalRaised = !prev.totalRaised.eq(totalRaised);
  const hasChanged =
    !prev.funds || prev.funds.length !== funds.length ||
    hasNewActiveCap || hasNewActiveRaised ||
    hasNewTotalCap || hasNewTotalRaised ||
    funds.some(({ info: { end }, isEnded }) => !isEnded && bestNumber.gt(end));

  if (!hasChanged) {
    return prev;
  }

  return {
    activeCap: hasNewActiveCap
      ? activeCap
      : prev.activeCap,
    activeRaised: hasNewActiveRaised
      ? activeRaised
      : prev.activeRaised,
    funds: funds.map((data): Campaign => {
      if (!data.isEnded && bestNumber.gt(data.info.end)) {
        data.isEnded = true;
      }

      return data;
    }),
    totalCap: hasNewTotalCap
      ? totalCap
      : prev.totalCap,
    totalRaised: hasNewTotalRaised
      ? totalRaised
      : prev.totalRaised
  };
}

export default function useFunds (): Result {
  const { api } = useApi();
  const bestNumber = useBestNumber();
  const [paraIds, setParaIds] = useState<ParaId[]>([]);
  const trigger = useEventTrigger([api.events.crowdloan.Created]);
  const optFunds = useCallMulti<Option<FundInfo>[]>(paraIds.map((id) => [api.query.crowdloan.funds, id]));
  const [result, setResult] = useState<Result>(EMPTY);

  // we actually want to split this further info completed and ongoing
  const campaigns = useMemo(
    () => extractCampaigns(optFunds, paraIds),
    [optFunds, paraIds]
  );

  // on event triggers, update the available paraIds
  useEffect((): void => {
    trigger &&
      api.query.crowdloan.funds
        .keys<[ParaId]>()
        .then((indexes) => setParaIds(
          indexes.map(({ args: [paraId] }) => paraId))
        )
        .catch(console.error);
  }, [api, trigger]);

  // here we manually add the actual ending status and calculate the totals
  useEffect((): void => {
    bestNumber && campaigns && setResult((prev) =>
      createResult(bestNumber, campaigns, prev)
    );
  }, [bestNumber, campaigns]);

  return result;
}
