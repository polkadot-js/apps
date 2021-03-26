// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId, BalanceOf, BlockNumber, FundInfo, ParaId } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';
import type { Campaign, Lease } from './types';

import BN from 'bn.js';
import { useEffect, useState } from 'react';

import { useApi, useBestNumber, useCall, useEventTrigger } from '@polkadot/react-hooks';
import { BN_ZERO, stringToU8a, u8aConcat, u8aEq } from '@polkadot/util';

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

const PREFIX = stringToU8a('modlpy/cfund');

function hasLease (paraId: ParaId, leases: Lease[]): boolean {
  const info = leases.find((l) => paraId.eq(l.paraId));

  if (info) {
    const paraAccountId = u8aConcat(PREFIX, paraId.toU8a());

    return info.leases.some(({ accountId }) =>
      u8aEq(paraAccountId, accountId.toU8a().slice(0, paraAccountId.length))
    );
  }

  return false;
}

// map into a campaign
function updateCampaign (bestNumber: BN, minContribution: BN, retirementPeriod: BN, data: Campaign, leases: Lease[]): Campaign {
  if (!data.isEnded && bestNumber.gt(data.info.end)) {
    data.isEnded = true;
  }

  if (!data.isCapped && data.info.cap.sub(data.info.raised).lt(minContribution)) {
    data.isCapped = true;
  }

  if (!data.retireEnd) {
    data.retireEnd = data.info.end.add(retirementPeriod);
  }

  if (!data.isRetired && bestNumber.gt(data.retireEnd)) {
    data.isRetired = true;
  }

  if (!data.isWinner && hasLease(data.paraId, leases)) {
    data.isWinner = true;
  }

  return data;
}

function isFundUpdated (bestNumber: BlockNumber, minContribution: BN, retirementPeriod: BN, { info: { cap, end, raised }, isCapped, isEnded, isRetired, isWinner, paraId }: Campaign, leases: Lease[]): boolean {
  return (!isEnded && bestNumber.gt(end)) ||
    (!isCapped && cap.sub(raised).lt(minContribution)) ||
    (!isRetired && bestNumber.gt(end.add(retirementPeriod))) ||
    (!isWinner && hasLease(paraId, leases));
}

// compare the current campaigns against the previous, manually adding ending and calculating the new totals
function createResult (bestNumber: BlockNumber, minContribution: BN, retirementPeriod: BN, funds: Campaign[], leases: Lease[], prev: Result): Result {
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
    funds.some((c) => isFundUpdated(bestNumber, minContribution, retirementPeriod, c, leases)) ||
    true;

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
    funds: funds
      .map((c) => updateCampaign(bestNumber, minContribution, retirementPeriod, c, leases))
      .sort((a, b) =>
        a.isWinner !== b.isWinner
          ? a.isWinner
            ? -1
            : 1
          : a.isCapped !== b.isCapped
            ? a.isCapped
              ? -1
              : 1
            : a.isRetired !== b.isRetired
              ? a.isRetired
                ? 1
                : -1
              : a.isEnded !== b.isEnded
                ? a.isEnded
                  ? 1
                  : -1
                : 0
      ),
    totalCap: hasNewTotalCap
      ? totalCap
      : prev.totalCap,
    totalRaised: hasNewTotalRaised
      ? totalRaised
      : prev.totalRaised
  };
}

const optFundMulti = {
  transform: ([[paraIds], optFunds]: [[ParaId[]], Option<FundInfo>[]]): Campaign[] =>
    paraIds
      .map((paraId, i): [ParaId, FundInfo | null] => [paraId, optFunds[i].unwrapOr(null)])
      .filter((v): v is [ParaId, FundInfo] => !!v[1])
      .map(([paraId, info]) => ({ info, key: paraId.toString(), paraId }))
      .sort((a, b) => a.info.firstSlot.cmp(b.info.firstSlot) || a.info.lastSlot.cmp(b.info.lastSlot) || a.paraId.cmp(b.paraId)),
  withParamsTransform: true
};

const optLeaseMulti = {
  transform: ([[paraIds], leases]: [[ParaId[]], Option<ITuple<[AccountId, BalanceOf]>>[][]]): Lease[] =>
    paraIds.map((paraId, i): Lease => ({
      leases: leases[i]
        .map((o) => o.unwrapOr(null))
        .filter((v): v is ITuple<[AccountId, BalanceOf]> => !!v)
        .map(([accountId, balance]) => ({ accountId, balance })),
      paraId
    })),
  withParamsTransform: true
};

export default function useFunds (): Result {
  const { api } = useApi();
  const bestNumber = useBestNumber();
  const [paraIds, setParaIds] = useState<ParaId[]>([]);
  const trigger = useEventTrigger([api.events.crowdloan.Created]);
  const campaigns = useCall<Campaign[]>(api.query.crowdloan.funds.multi, [paraIds], optFundMulti);
  const leases = useCall<Lease[]>(api.query.slots.leases.multi, [paraIds], optLeaseMulti);
  const [result, setResult] = useState<Result>(EMPTY);

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
    bestNumber && campaigns && leases && setResult((prev) =>
      createResult(bestNumber, api.consts.crowdloan.minContribution as BlockNumber, api.consts.crowdloan.retirementPeriod as BlockNumber, campaigns, leases, prev)
    );
  }, [api, bestNumber, campaigns, leases]);

  return result;
}
