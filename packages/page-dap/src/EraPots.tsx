// Copyright 2017-2026 @polkadot/app-dap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';

import { AddressMini, Button, Table } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { BN, BN_ZERO } from '@polkadot/util';

import { headingStyle } from './styles.js';
import { useTranslation } from './translate.js';
import { type EraSnapshot, type PotSnapshot, useEraSnapshot } from './useEraSnapshot.js';

interface Props {
  activeEra?: number;
  historyDepth?: number;
}

const WINDOW_SIZE = 3;

// Compute `budget - remaining` as a percentage of budget with 1-decimal
// precision. Returns undefined when budget is absent or zero, so the UI can
// show a dash instead of "0%" for pots that never had a budget.
function spentPct (budget: BN | undefined, remaining: BN | undefined): string | undefined {
  if (!budget || budget.isZero()) {
    return undefined;
  }

  const rem = remaining ?? BN_ZERO;
  const spent = budget.sub(rem);

  if (spent.isNeg()) {
    return '0%';
  }

  const scaled = spent.muln(1000).div(budget).toNumber();
  const whole = Math.floor(scaled / 10);
  const frac = scaled % 10;

  return `${whole}.${frac}%`;
}

// Resolve the effective remaining balance for a pot.
//
// For a still-running era we only trust the live subscription. For an ended
// era the pot can't change anymore, so if the subscription is unavailable
// (typical case: the pot account view function didn't resolve) we can safely
// display `budget` as remaining — equivalent to "nothing has been claimed yet".
function effectiveRemaining (budget: BN | undefined, remaining: BN | undefined, isEnded: boolean): BN | undefined {
  if (remaining) {
    return remaining;
  }

  if (isEnded && budget) {
    return budget;
  }

  return undefined;
}

const pickStaker = (s: EraSnapshot): PotSnapshot => s.staker;
const pickIncentive = (s: EraSnapshot): PotSnapshot => s.incentive;

interface PotRowsProps {
  pick: (s: EraSnapshot) => PotSnapshot;
  snapshots: EraSnapshot[];
  t: (key: string) => string;
  title: string;
}

function PotRows ({ pick, snapshots, t, title }: PotRowsProps): React.ReactElement {
  return (
    <>
      <tr>
        <td
          colSpan={snapshots.length + 1}
          style={{ fontWeight: 600, letterSpacing: '0.02em', opacity: 0.75, paddingTop: '1rem', textTransform: 'uppercase' }}
        >
          {title}
        </td>
      </tr>
      <tr>
        <td>{t('account')}</td>
        {snapshots.map((s) => {
          const pot = pick(s);

          return (
            <td key={s.era}>
              {pot.account
                ? <AddressMini value={pot.account} />
                : '—'
              }
            </td>
          );
        })}
      </tr>
      <tr>
        <td>{t('budget')}</td>
        {snapshots.map((s) => {
          const pot = pick(s);

          return (
            <td key={s.era}>
              {pot.budget && !pot.budget.isZero()
                ? <FormatBalance value={pot.budget} />
                : '—'
              }
            </td>
          );
        })}
      </tr>
      <tr>
        <td>{t('remaining')}</td>
        {snapshots.map((s) => {
          const pot = pick(s);
          const rem = effectiveRemaining(pot.budget, pot.remaining, s.isEnded);

          return (
            <td key={s.era}>
              {rem
                ? <FormatBalance value={rem} />
                : '—'
              }
            </td>
          );
        })}
      </tr>
      <tr>
        <td>{t('spent')}</td>
        {snapshots.map((s) => {
          const pot = pick(s);
          const rem = effectiveRemaining(pot.budget, pot.remaining, s.isEnded);
          const pct = spentPct(pot.budget, rem);
          const spentBn = pot.budget && rem
            ? BN.max(BN_ZERO, pot.budget.sub(rem))
            : undefined;

          return (
            <td key={s.era}>
              {spentBn
                ? (
                  <span>
                    <FormatBalance value={spentBn} />
                    {pct && <span style={{ marginLeft: '0.4rem', opacity: 0.7 }}>({pct})</span>}
                  </span>
                )
                : '—'
              }
            </td>
          );
        })}
      </tr>
    </>
  );
}

function EraPots ({ activeEra, historyDepth }: Props): React.ReactElement | null {
  const { t } = useTranslation();

  // `anchor` = newest era in the visible window. Defaults to the active era,
  // and the window extends backwards from there. Clamped so we can't scroll
  // past history depth (oldest) or past the active era (newest).
  const [anchor, setAnchor] = useState<number | undefined>();
  const effectiveAnchor = anchor ?? activeEra;

  const minEra = useMemo(() => {
    if (activeEra === undefined || historyDepth === undefined) {
      return 0;
    }

    return Math.max(0, activeEra - historyDepth + 1);
  }, [activeEra, historyDepth]);

  // Eras displayed as columns, newest first. If anchor is 5, shows [5, 4, 3].
  // Window collapses naturally at the low end (e.g. anchor=1 → [1, 0]).
  const eras = useMemo(() => {
    if (effectiveAnchor === undefined) {
      return [];
    }

    const list: number[] = [];

    for (let i = 0; i < WINDOW_SIZE; i++) {
      const e = effectiveAnchor - i;

      if (e >= minEra) {
        list.push(e);
      }
    }

    return list;
  }, [effectiveAnchor, minEra]);

  // Can go earlier whenever the oldest visible era is above `minEra`. This lets
  // you walk all the way down to era 0 (or `active - HistoryDepth`) even when
  // the final window is partial (e.g. just [0] or [1, 0]).
  const canGoEarlier = eras.length > 0 && eras[eras.length - 1] > minEra;
  const canGoLater = effectiveAnchor !== undefined && activeEra !== undefined && effectiveAnchor < activeEra;

  const onEarlier = useCallback(() => {
    if (effectiveAnchor === undefined) {
      return;
    }

    // Shift anchor back by one window. Never drop below `minEra` — instead
    // clamp so the leftmost column is at `minEra + WINDOW_SIZE - 1` at worst,
    // or `minEra` if that's already below.
    setAnchor(Math.max(minEra, effectiveAnchor - WINDOW_SIZE));
  }, [effectiveAnchor, minEra]);

  const onLater = useCallback(() => {
    if (effectiveAnchor === undefined || activeEra === undefined) {
      return;
    }

    setAnchor(Math.min(activeEra, effectiveAnchor + WINDOW_SIZE));
  }, [effectiveAnchor, activeEra]);

  const onReset = useCallback(() => setAnchor(undefined), []);

  // Fixed window of 3 slots — `useEraSnapshot` MUST be called in a stable order
  // per React's rules of hooks, so we always call 3 regardless of how many
  // columns are visible.
  const snap0 = useEraSnapshot(eras[0], activeEra);
  const snap1 = useEraSnapshot(eras[1], activeEra);
  const snap2 = useEraSnapshot(eras[2], activeEra);
  const snapshots = useMemo(
    () => [snap0, snap1, snap2].filter((s): s is EraSnapshot => s !== undefined),
    [snap0, snap1, snap2]
  );

  if (activeEra === undefined) {
    return null;
  }

  return (
    <>
      <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem', margin: '1.5rem 0 0.75rem' }}>
        <h2 style={{ ...headingStyle, margin: 0 }}>
          {t('Reward eras')}
        </h2>
        <div style={{ flex: 1 }} />
        <Button
          icon='arrow-left'
          isDisabled={!canGoEarlier}
          label={t('earlier')}
          onClick={onEarlier}
        />
        <Button
          icon='arrow-right'
          isDisabled={!canGoLater}
          label={t('later')}
          onClick={onLater}
        />
        <Button
          icon='rotate'
          isDisabled={anchor === undefined}
          label={t('active')}
          onClick={onReset}
        />
      </div>
      <Table
        header={[
          [t('era'), 'start'],
          ...snapshots.map((s): [React.ReactNode, string] => [
            (
              <>
                {t('era {{era}}', { replace: { era: s.era } })}
                {s.isCurrent && <span style={{ marginLeft: '0.4rem', opacity: 0.65 }}>({t('active')})</span>}
              </>
            ),
            'start'
          ])
        ]}
      >
        <tr>
          <td><strong>{t('total stake')}</strong></td>
          {snapshots.map((s) => (
            <td key={s.era}>
              {s.totalStake
                ? <FormatBalance value={s.totalStake} />
                : '—'
              }
            </td>
          ))}
        </tr>
        <PotRows
          pick={pickStaker}
          snapshots={snapshots}
          t={t}
          title={t('staker rewards pot')}
        />
        <PotRows
          pick={pickIncentive}
          snapshots={snapshots}
          t={t}
          title={t('validator incentive pot')}
        />
      </Table>
    </>
  );
}

export default React.memo(EraPots);
