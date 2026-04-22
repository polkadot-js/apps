// Copyright 2017-2026 @polkadot/app-dap authors & contributors
// SPDX-License-Identifier: Apache-2.0

// DAP-specific runtime APIs and storage items are not augmented into the
// polkadot-js typings for this test runtime, so we access them via `any`.
// These checks are intentionally disabled file-wide to keep the hook readable.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unnecessary-type-assertion */

import type { ApiPromise } from '@polkadot/api';
import type { FrameSystemAccountInfo } from '@polkadot/types/lookup';

import { useEffect, useMemo, useState } from 'react';

import { useApi, useBlockEvents, useCall, useCallMulti, useViewFunction } from '@polkadot/react-hooks';
import { BN, BN_ZERO, u8aToHex, u8aToString } from '@polkadot/util';

const PERBILL = new BN(1_000_000_000);

export interface RecipientRow {
  account: string;
  allocation: BN;
  balance?: BN;
  key: string;
  /** Recipient's share of the most recent drip, derived from `allocation × lastMintAmount`. */
  lastMint?: BN;
}

export interface DapInfo {
  /** Session index at which the active era started (`BondedEras` last entry). */
  activeEraStartSession?: number;
  cadenceMs?: number;
  disableMintingGuard?: number;
  hasDapApi: boolean;
  historyDepth?: number;
  isDapActive: boolean;
  isDapPending: boolean;
  lastDripTimestamp?: number;
  /** Total amount minted in the most recent `dap.IssuanceMinted` event seen this session. */
  lastMintAmount?: BN;
  /** Last RC session index reported to the parachain, read straight from `stakingRcClient.lastSessionReportEndingIndex`. */
  lastSessionReportEndingIndex?: number;
  maxElapsedPerDripMs?: number;
  planningEra?: number;
  recipients: RecipientRow[];
}

function decodeKey (raw: Uint8Array): string {
  const printable = raw.every((b) => b >= 0x20 && b <= 0x7e);

  return printable ? u8aToString(raw) : u8aToHex(raw);
}

function readConstNumber (api: ApiPromise, pallet: string, name: string): number | undefined {
  const c = (api.consts[pallet] as any)?.[name];

  return c ? (c as any).toNumber() : undefined;
}

// Decode a PJS codec that may be `Option<Codec>` or a primitive-like codec into
// `number | undefined`. Handles the two shapes we see from `useCall` without
// assuming either one.
function decodeOptionalNumber (codec: any): number | undefined {
  if (!codec) {
    return undefined;
  }

  if (typeof codec.isNone === 'boolean') {
    return codec.isNone ? undefined : codec.unwrap().toNumber();
  }

  if (codec.isEmpty) {
    return undefined;
  }

  if (typeof codec.toNumber === 'function') {
    return codec.toNumber();
  }

  return undefined;
}

/**
 * Single entry point for every DAP read: presence gating, recipient view-fn,
 * live balances, block-event tracking, and sticky-latching for values that
 * flicker to undefined during reconnect. Keeps `Overview` focused on render.
 */
export function useDapInfo (): DapInfo {
  const { api, isApiReady } = useApi();

  // Presence signal: the `dap` pallet wires its storage via
  // `api.query.dap.budgetAllocation`. Latch once true so a transient reconnect
  // doesn't flip the UI to the "no DAP pallet" placeholder mid-session.
  const hasDapApiNow = isApiReady && !!api.query.dap?.budgetAllocation;
  const [hasDapApi, setHasDapApi] = useState(hasDapApiNow);

  useEffect(() => {
    if (hasDapApiNow && !hasDapApi) {
      setHasDapApi(true);
    }
  }, [hasDapApi, hasDapApiNow]);

  // `Dap::budget_recipients` view function returns
  // `Vec<(BudgetKey, AccountId, Perbill)>` — a positional tuple per entry.
  const recipientsResult = useViewFunction('Dap', 'budget_recipients', hasDapApi ? { args: [] } : {});

  const recipientsRaw = useMemo<[Uint8Array, string, BN][] | undefined>(() => {
    if (!recipientsResult) {
      return undefined;
    }

    return ((recipientsResult as any).toArray?.() ?? []).map((entry: any) => [
      entry[0].toU8a(true),
      entry[1].toString(),
      entry[2].toBn()
    ] as [Uint8Array, string, BN]);
  }, [recipientsResult]);

  const accounts = useMemo(
    () => recipientsRaw?.map(([, account]) => account) ?? [],
    [recipientsRaw]
  );

  // Memoized so `useCallMulti` doesn't see a fresh outer array every render.
  const accountQueries = useMemo(
    () => (accounts.length && api.query.system?.account)
      ? accounts.map((a) => [api.query.system.account, a] as [typeof api.query.system.account, string])
      : null,
    [accounts, api]
  );

  const accountInfos = useCallMulti<FrameSystemAccountInfo[]>(accountQueries);

  const lastDripTimestamp = useCall<any>(api.query.dap?.lastIssuanceTimestamp);
  const disableMintingGuard = useCall<any>(api.query.staking?.disableMintingGuard);
  const activeEra = useCall<any>(api.query.staking?.activeEra);
  // `lastSessionReportEndingIndex` is the last RC session the parachain heard
  // about. The *ongoing* session is one ahead of it. The parachain's own
  // `pallet_session` is unrelated (slow collator-rotation loop) and not what
  // users expect to see here.
  const lastSessionReportEnding = useCall<any>(api.query.stakingRcClient?.lastSessionReportEndingIndex);
  // `BondedEras` stores `(era, first_session_of_era)`; the matching entry is
  // the current active era's start session.
  const bondedEras = useCall<any>(api.query.staking?.bondedEras);

  // Track the amount minted in the most recent `dap.IssuanceMinted` event.
  // This only captures events observed while the page is open — refreshing
  // resets the tracker until the next drip lands. Acceptable for a debug
  // view; the first post-refresh drip repopulates it (typically within a few
  // blocks given `IssuanceCadence`).
  const blockEvents = useBlockEvents();
  const [lastMintAmount, setLastMintAmount] = useState<BN | undefined>();

  useEffect(() => {
    if (!blockEvents?.events?.length) {
      return;
    }

    let latest: BN | undefined;

    for (const keyed of blockEvents.events) {
      const { event } = keyed.record;

      if (event.section === 'dap' && event.method === 'IssuanceMinted') {
        const total = (event.data as any).totalMinted?.toBn?.() as BN | undefined;

        if (total) {
          latest = total;
        }
      }
    }

    if (latest) {
      const next = latest;

      setLastMintAmount((prev) => prev && prev.eq(next) ? prev : next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockEvents]);

  // `ActiveEra` is set at genesis and monotonically increases — it's never
  // legitimately None on a running chain. But `useCall` can briefly return
  // `undefined` during reconnect, which would blank out every era-dependent
  // card and flip the mode tag to "Legacy". Latch the last-good value to
  // avoid that UI flash.
  const [planningEra, setPlanningEra] = useState<number | undefined>();

  useEffect(() => {
    if (activeEra && !activeEra.isNone) {
      const next = activeEra.unwrap().index.toNumber();

      setPlanningEra((prev) => prev === next ? prev : next);
    }
  }, [activeEra]);

  const activeEraStartSession = useMemo(() => {
    if (!bondedEras || planningEra === undefined) {
      return undefined;
    }

    const entries = bondedEras.toArray?.() as { toJSON: () => [number, number] }[] | undefined;

    if (!entries || entries.length === 0) {
      return undefined;
    }

    for (let i = entries.length - 1; i >= 0; i--) {
      const [era, startSession] = entries[i].toJSON();

      if (era === planningEra) {
        return startSession;
      }
    }

    return undefined;
  }, [bondedEras, planningEra]);

  const lastSessionReportEndingIndex = useMemo(
    () => decodeOptionalNumber(lastSessionReportEnding),
    [lastSessionReportEnding]
  );

  const cadenceMs = useMemo(() => readConstNumber(api, 'dap', 'issuanceCadence'), [api]);
  const maxElapsedPerDripMs = useMemo(() => readConstNumber(api, 'dap', 'maxElapsedPerDrip'), [api]);
  const historyDepth = useMemo(() => readConstNumber(api, 'staking', 'historyDepth'), [api]);

  const rawGuardEra = useMemo(
    () => decodeOptionalNumber(disableMintingGuard),
    [disableMintingGuard]
  );

  // `DisableMintingGuard` is irreversible on-chain: once set, never cleared.
  // Latch the first non-undefined value so transient `useCall` blips don't
  // briefly flip the mode tag back to "Legacy".
  const [guardEra, setGuardEra] = useState<number | undefined>();

  useEffect(() => {
    if (rawGuardEra !== undefined) {
      setGuardEra((prev) => prev === rawGuardEra ? prev : rawGuardEra);
    }
  }, [rawGuardEra]);

  // Mode classification:
  // - guard unset                             -> legacy (no DAP snapshot yet)
  // - guard set, current era past the guard   -> DAP active
  // - guard set, current era before the guard -> DAP pending (activates soon)
  const { isDapActive, isDapPending } = useMemo(() => {
    if (guardEra === undefined) {
      return { isDapActive: false, isDapPending: false };
    }

    if (planningEra !== undefined && planningEra >= guardEra) {
      return { isDapActive: true, isDapPending: false };
    }

    return { isDapActive: false, isDapPending: true };
  }, [guardEra, planningEra]);

  const recipients = useMemo((): RecipientRow[] => {
    if (!recipientsRaw) {
      return [];
    }

    return recipientsRaw.map(([keyRaw, account, allocation], idx) => {
      // `lastMint` derives from the latest `IssuanceMinted` total × the
      // *current* allocation share. If allocation changed since the last
      // drip (sudo-only, rare), the per-row value is stale until the next
      // drip — acceptable for a debug surface.
      const lastMint = lastMintAmount
        ? lastMintAmount.mul(allocation).div(PERBILL)
        : undefined;

      return {
        account,
        allocation,
        balance: accountInfos?.[idx]?.data?.free,
        key: decodeKey(keyRaw),
        lastMint: lastMint && !lastMint.eq(BN_ZERO) ? lastMint : undefined
      };
    });
  }, [recipientsRaw, accountInfos, lastMintAmount]);

  return {
    activeEraStartSession,
    cadenceMs,
    disableMintingGuard: guardEra,
    hasDapApi,
    historyDepth,
    isDapActive,
    isDapPending,
    lastDripTimestamp: lastDripTimestamp ? (lastDripTimestamp as any).toNumber() : undefined,
    lastMintAmount,
    lastSessionReportEndingIndex,
    maxElapsedPerDripMs,
    planningEra,
    recipients
  };
}
