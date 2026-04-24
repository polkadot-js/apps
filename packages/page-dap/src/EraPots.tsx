// Copyright 2017-2026 @polkadot/app-dap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';

import { AddressMini, Input, Table } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { BN, BN_ZERO } from '@polkadot/util';

import { headingStyle } from './styles.js';
import { useTranslation } from './translate.js';
import { type EraSnapshot, type PotSnapshot, useEraSnapshot } from './useEraSnapshot.js';

interface Props {
  activeEra?: number;
  historyDepth?: number;
}

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

  // First era still retained in storage. With `activeEra` ongoing, the last
  // `historyDepth` *completed* eras `[activeEra - historyDepth, activeEra - 1]`
  // are retained. Anything below `firstRetainedEra` is a pruning candidate.
  const firstRetainedEra = useMemo(() => {
    if (activeEra === undefined || historyDepth === undefined) {
      return undefined;
    }

    return Math.max(0, activeEra - historyDepth);
  }, [activeEra, historyDepth]);

  // The last completed era is always `active - 1`; undefined at genesis.
  const lastCompletedEra = activeEra !== undefined && activeEra > 0
    ? activeEra - 1
    : undefined;

  // Raw input string so the user can clear/retype freely; we only commit the
  // parsed value when it's a non-negative integer <= activeEra. Pre-history
  // eras are allowed so the user can confirm cleanup.
  const [customInput, setCustomInput] = useState<string>('');

  const customEra = useMemo(() => {
    const trimmed = customInput.trim();

    if (trimmed === '' || activeEra === undefined) {
      return undefined;
    }

    if (!/^\d+$/.test(trimmed)) {
      return undefined;
    }

    const n = parseInt(trimmed, 10);

    if (n > activeEra) {
      return undefined;
    }

    return n;
  }, [activeEra, customInput]);

  const customInvalid = customInput.trim() !== '' && customEra === undefined;
  // Pruning runs synchronously at era-end, so an era below `firstRetainedEra`
  // is always pruned — no on-chain lookup needed.
  const customIsPruned = customEra !== undefined && firstRetainedEra !== undefined && customEra < firstRetainedEra;

  const onChangeCustom = useCallback((value: string) => {
    setCustomInput(value);
  }, []);

  // Hooks must be called in a stable order — always two era slots.
  const snapLast = useEraSnapshot(lastCompletedEra, activeEra);
  const snapCustom = useEraSnapshot(customEra, activeEra);

  const snapshots = useMemo(
    () => [snapLast, snapCustom].filter((s): s is EraSnapshot => s !== undefined),
    [snapLast, snapCustom]
  );

  if (activeEra === undefined) {
    return null;
  }

  return (
    <>
      <div style={{ alignItems: 'center', display: 'flex', gap: '0.75rem', margin: '1.5rem 0 0.75rem' }}>
        <h2 style={{ ...headingStyle, margin: 0 }}>
          {t('Reward eras')}
        </h2>
        <div style={{ flex: 1 }} />
        <div style={{ minWidth: '16rem' }}>
          <Input
            isError={customInvalid}
            label={t('inspect era')}
            onChange={onChangeCustom}
            placeholder={t('any era up to {{max}}', { replace: { max: activeEra } })}
            value={customInput}
          />
        </div>
      </div>
      <Table
        header={[
          [t('era'), 'start'],
          ...(lastCompletedEra !== undefined
            ? [[
              <>
                {t('era {{era}}', { replace: { era: lastCompletedEra } })}
                <span style={{ marginLeft: '0.4rem', opacity: 0.65 }}>({t('last completed')})</span>
              </>,
              'start'
            ] as [React.ReactNode, string]]
            : []),
          ...(customEra !== undefined
            ? [[
              <>
                {t('era {{era}}', { replace: { era: customEra } })}
                {customEra === activeEra && <span style={{ marginLeft: '0.4rem', opacity: 0.65 }}>({t('active')})</span>}
                {customIsPruned && <span style={{ marginLeft: '0.4rem', opacity: 0.65 }}>({t('pruned')})</span>}
              </>,
              'start'
            ] as [React.ReactNode, string]]
            : [])
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
