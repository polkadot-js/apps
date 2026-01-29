// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { AccountId, BalanceOf, BlockNumber, ParaId } from '@polkadot/types/interfaces';
import type { PolkadotRuntimeCommonCrowdloanFundInfo } from '@polkadot/types/lookup';
import type { INumber, ITuple } from '@polkadot/types/types';
import type { Campaign, Campaigns } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useBestNumber, useCall, useEventTrigger, useIsMountedRef, useMapKeys } from '@polkadot/react-hooks';
import { BN, BN_ZERO, u8aConcat, u8aEq } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

import { CROWD_PREFIX } from './constants.js';

const EMPTY: Campaigns = {
  activeCap: BN_ZERO,
  activeRaised: BN_ZERO,
  funds: null,
  isLoading: true,
  totalCap: BN_ZERO,
  totalRaised: BN_ZERO
};

const EMPTY_U8A = new Uint8Array(32);

function createAddress (id: INumber): Uint8Array {
  return u8aConcat(CROWD_PREFIX, id.toU8a(), EMPTY_U8A).subarray(0, 32);
}

function hasCrowdloadPrefix (accountId: AccountId): boolean {
  return u8aEq(accountId.slice(0, CROWD_PREFIX.length), CROWD_PREFIX);
}

function hasLease (paraId: ParaId, leased: ParaId[]): boolean {
  return leased.some((l) => l.eq(paraId));
}

// map into a campaign
function updateFund (bestNumber: BN, minContribution: BN, data: Campaign, leased: ParaId[]): Campaign {
  data.isCapped = data.info.cap.sub(data.info.raised).lt(minContribution);
  data.isEnded = bestNumber.gt(data.info.end);
  data.isWinner = hasLease(data.paraId, leased);

  return data;
}

function isFundUpdated (bestNumber: BlockNumber, minContribution: BN, { info: { cap, end, raised }, paraId }: Campaign, leased: ParaId[], allPrev: Campaigns): boolean {
  const prev = allPrev.funds?.find((p) => p.paraId.eq(paraId));

  return !prev ||
    (!prev.isEnded && bestNumber.gt(end)) ||
    (!prev.isCapped && cap.sub(raised).lt(minContribution)) ||
    (!prev.isWinner && hasLease(paraId, leased));
}

function sortCampaigns (a: Campaign, b: Campaign): number {
  return a.isWinner !== b.isWinner
    ? a.isWinner
      ? -1
      : 1
    : a.isCapped !== b.isCapped
      ? a.isCapped
        ? -1
        : 1
      : a.isEnded !== b.isEnded
        ? a.isEnded
          ? 1
          : -1
        : 0;
}

// compare the current campaigns against the previous, manually adding ending and calculating the new totals
function createResult (bestNumber: BlockNumber, minContribution: BN, funds: Campaign[], leased: ParaId[], prev: Campaigns): Campaigns {
  const [activeRaised, activeCap, totalRaised, totalCap] = funds.reduce(([ar, ac, tr, tc], { info: { cap, end, raised }, isWinner }) => [
    (bestNumber.gt(end) || isWinner) ? ar : ar.iadd(raised),
    (bestNumber.gt(end) || isWinner) ? ac : ac.iadd(cap),
    tr.iadd(raised),
    tc.iadd(cap)
  ], [new BN(0), new BN(0), new BN(0), new BN(0)]);
  const hasNewActiveCap = !prev.activeCap.eq(activeCap);
  const hasNewActiveRaised = !prev.activeRaised.eq(activeRaised);
  const hasNewTotalCap = !prev.totalCap.eq(totalCap);
  const hasNewTotalRaised = !prev.totalRaised.eq(totalRaised);
  const hasChanged =
    !prev.funds || prev.funds.length !== funds.length ||
    hasNewActiveCap || hasNewActiveRaised || hasNewTotalCap || hasNewTotalRaised ||
    funds.some((c) => isFundUpdated(bestNumber, minContribution, c, leased, prev));

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
      .map((c) => updateFund(bestNumber, minContribution, c, leased))
      .sort(sortCampaigns),
    totalCap: hasNewTotalCap
      ? totalCap
      : prev.totalCap,
    totalRaised: hasNewTotalRaised
      ? totalRaised
      : prev.totalRaised
  };
}

const OPT_FUNDS_MULTI = {
  transform: ([[paraIds], optFunds]: [[ParaId[]], Option<PolkadotRuntimeCommonCrowdloanFundInfo>[]]): Campaign[] =>
    paraIds
      .map((paraId, i): [ParaId, PolkadotRuntimeCommonCrowdloanFundInfo | null] => [paraId, optFunds[i].unwrapOr(null)])
      .filter((v): v is [ParaId, PolkadotRuntimeCommonCrowdloanFundInfo] => !!v[1])
      .map(([paraId, info]): Campaign => ({
        accountId: encodeAddress(createAddress(paraId)),
        firstSlot: info.firstPeriod,
        info,
        isCrowdloan: true,
        key: paraId.toString(),
        lastSlot: info.lastPeriod,
        paraId,
        value: info.raised
      }))
      .sort((a, b) =>
        a.info.end.cmp(b.info.end) ||
        a.info.firstPeriod.cmp(b.info.firstPeriod) ||
        a.info.lastPeriod.cmp(b.info.lastPeriod) ||
        a.paraId.cmp(b.paraId)
      ),
  withParamsTransform: true
};

const OPT_LEASE = {
  transform: ([[paraIds], leases]: [[ParaId[]], Option<ITuple<[AccountId, BalanceOf]>>[][]]): ParaId[] =>
    paraIds.filter((_, i) =>
      leases[i]
        .map((o) => o.unwrapOr(null))
        .filter((v): v is ITuple<[AccountId, BalanceOf]> => !!v)
        .filter(([accountId]) => hasCrowdloadPrefix(accountId))
        .length !== 0
    ),
  withParamsTransform: true
};

const OPT_FUNDS = {
  transform: (keys: StorageKey<[ParaId]>[]): ParaId[] =>
    keys.map(({ args: [paraId] }) => paraId)
};

function useFundsImpl (): Campaigns {
  const { api } = useApi();
  const bestNumber = useBestNumber();
  const mountedRef = useIsMountedRef();
  const trigger = useEventTrigger([api.events.crowdloan?.Created]);
  const paraIds = useMapKeys(api.query.crowdloan?.funds, [], OPT_FUNDS, trigger.blockHash);
  const campaigns = useCall<Campaign[]>(api.query.crowdloan?.funds.multi, [paraIds], OPT_FUNDS_MULTI);
  const leases = useCall<ParaId[]>(api.query.slots.leases.multi, [paraIds], OPT_LEASE);
  const [result, setResult] = useState<Campaigns>(EMPTY);

  // here we manually add the actual ending status and calculate the totals
  useEffect((): void => {
    mountedRef.current && bestNumber && campaigns && leases && setResult((prev) =>
      createResult(bestNumber, api.consts.crowdloan.minContribution as BlockNumber, campaigns, leases, prev)
    );
  }, [api, bestNumber, campaigns, leases, mountedRef]);

  return result;
}

export default createNamedHook('useFunds', useFundsImpl);
