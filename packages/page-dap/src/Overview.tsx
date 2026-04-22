// Copyright 2017-2026 @polkadot/app-dap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo, useState } from 'react';

import { AddressMini, CardSummary, MarkWarning, SummaryBox, Table, Tag } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { BN, BN_ZERO, formatNumber } from '@polkadot/util';

import EraPots from './EraPots.js';
import { headingStyle, sectionStyle } from './styles.js';
import { useTranslation } from './translate.js';
import { useDapInfo } from './useDapInfo.js';

const PERBILL = new BN(1_000_000_000);

function formatDuration (ms: number, prefix: 'every' | 'max'): string {
  if (ms === 0) {
    return prefix === 'max' ? 'max per block' : 'every block';
  }

  const seconds = Math.floor(ms / 1_000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remMin = minutes % 60;

    return remMin > 0 ? `${prefix} ${hours}h ${remMin}m` : `${prefix} ${hours}h`;
  }

  if (minutes > 0) {
    const remSec = seconds % 60;

    return remSec > 0 ? `${prefix} ${minutes}m ${remSec}s` : `${prefix} ${minutes}m`;
  }

  return `${prefix} ${seconds}s`;
}

// Perbill → "12.345%" up to three decimals, trailing zeros stripped so round
// values render as "20%" rather than "20.000%".
function formatPerbill (parts: BN): string {
  if (parts.isZero()) {
    return '0%';
  }

  const scaled = parts.muln(100_000).div(PERBILL).toNumber();
  const whole = Math.floor(scaled / 1000);
  const fracRaw = (scaled % 1000).toString().padStart(3, '0').replace(/0+$/, '');

  return fracRaw.length === 0 ? `${whole}%` : `${whole}.${fracRaw}%`;
}

function formatRelativeAgo (ms: number): string {
  if (ms < 0) {
    return 'just now';
  }

  const seconds = Math.floor(ms / 1_000);

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  const remSec = seconds % 60;

  if (minutes < 60) {
    return remSec > 0 ? `${minutes}m ${remSec}s ago` : `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  const remMin = minutes % 60;

  return remMin > 0 ? `${hours}h ${remMin}m ago` : `${hours}h ago`;
}

// Isolated so the 1-Hz rerender stays scoped to the label and doesn't cascade
// through the whole Overview tree (including the EraPots table).
function LastDripLabel ({ minted, timestamp }: { minted?: BN; timestamp: number }): React.ReactElement {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);

    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div>{formatRelativeAgo(now - timestamp)}</div>
      {minted && (
        <div style={{ fontSize: '0.85rem', marginTop: '0.15rem', opacity: 0.75 }}>
          <FormatBalance value={minted} />
        </div>
      )}
    </>
  );
}

function ModeTag ({ isDapActive, isDapPending, t }: { isDapActive: boolean; isDapPending: boolean; t: (s: string) => string }): React.ReactElement {
  if (isDapActive) {
    return (
      <Tag
        color='green'
        label={t('DAP active')}
      />
    );
  }

  if (isDapPending) {
    return (
      <Tag
        color='yellow'
        label={t('DAP pending')}
      />
    );
  }

  return (
    <Tag
      color='grey'
      label={t('Legacy (minting)')}
    />
  );
}

function Overview (): React.ReactElement {
  const { t } = useTranslation();
  const info = useDapInfo();

  const totalAllocated = useMemo(
    () => info.recipients.reduce((sum, r) => sum.add(r.allocation), BN_ZERO),
    [info.recipients]
  );

  const allocationSumsToOne = totalAllocated.eq(PERBILL);

  const headerRef = React.useRef<[React.ReactNode?, string?, number?][]>([
    [t('budget key'), 'start'],
    [t('pot account'), 'address'],
    [t('allocation'), 'number'],
    [t('last mint'), 'number'],
    [t('live balance'), 'number']
  ]);

  return (
    <>
      <SummaryBox>
        <section style={sectionStyle}>
          <CardSummary label={t('mode')}>
            <ModeTag
              isDapActive={info.isDapActive}
              isDapPending={info.isDapPending}
              t={t}
            />
          </CardSummary>
          {info.cadenceMs !== undefined && (
            <CardSummary label={t('drip cadence')}>
              {formatDuration(info.cadenceMs, 'every')}
            </CardSummary>
          )}
          {info.maxElapsedPerDripMs !== undefined && (
            <CardSummary label={t('drip ceiling')}>
              {formatDuration(info.maxElapsedPerDripMs, 'max')}
            </CardSummary>
          )}
          {info.lastDripTimestamp !== undefined && (
            <CardSummary label={t('last drip')}>
              <LastDripLabel
                minted={info.lastMintAmount}
                timestamp={info.lastDripTimestamp}
              />
            </CardSummary>
          )}
        </section>
      </SummaryBox>
      {!info.hasDapApi && (
        <MarkWarning content={t('The connected runtime does not expose the Dap pallet. Connect to a chain that has DAP enabled.')} />
      )}
      {info.hasDapApi && info.recipients.length > 0 && totalAllocated.isZero() && (
        <MarkWarning content={t('BudgetAllocation is empty — no issuance is being distributed.')} />
      )}
      {info.hasDapApi && info.recipients.length > 0 && !totalAllocated.isZero() && !allocationSumsToOne && (
        <MarkWarning content={t('Allocations sum to {{sum}} — must equal 100% exactly.', { replace: { sum: formatPerbill(totalAllocated) } })} />
      )}
      <h2 style={headingStyle}>{t('Budget recipients')}</h2>
      <Table
        empty={info.recipients.length === 0 && info.hasDapApi && t('No registered budget recipients')}
        header={headerRef.current}
      >
        {info.recipients.map((r) => (
          <tr key={r.account}>
            <td className='start'><code>{r.key}</code></td>
            <td className='address'>
              <AddressMini value={r.account} />
            </td>
            <td className='number'>{formatPerbill(r.allocation)}</td>
            <td className='number'>
              {r.lastMint
                ? <FormatBalance value={r.lastMint} />
                : '—'
              }
            </td>
            <td className='number'>
              {r.balance
                ? <FormatBalance value={r.balance} />
                : '—'
              }
            </td>
          </tr>
        ))}
        {info.stagingAccount && (
          <tr key={info.stagingAccount}>
            <td className='start'>
              <code>{t('staging')}</code>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                {t('drained to buffer on idle')}
              </div>
            </td>
            <td className='address'>
              <AddressMini value={info.stagingAccount} />
            </td>
            <td className='number'>—</td>
            <td className='number'>—</td>
            <td className='number'>
              {info.stagingBalance
                ? <FormatBalance value={info.stagingBalance} />
                : '—'
              }
            </td>
          </tr>
        )}
      </Table>
      <h2 style={headingStyle}>{t('Staking eras')}</h2>
      <SummaryBox>
        <section style={sectionStyle}>
          {info.planningEra !== undefined && (
            <CardSummary label={t('active era')}>
              {formatNumber(info.planningEra)}
            </CardSummary>
          )}
          {info.activeEraStartSession !== undefined && (
            <CardSummary label={t('era started at session')}>
              {formatNumber(info.activeEraStartSession)}
            </CardSummary>
          )}
          {info.lastSessionReportEndingIndex !== undefined && (
            <CardSummary label={t('last ended session')}>
              {formatNumber(info.lastSessionReportEndingIndex)}
            </CardSummary>
          )}
          <CardSummary label={t('minting disabled (staking-async)')}>
            {info.disableMintingGuard !== undefined
              ? t('since era {{era}}', { replace: { era: info.disableMintingGuard } })
              : <span style={{ opacity: 0.6 }}>{t('unset')}</span>
            }
          </CardSummary>
        </section>
      </SummaryBox>
      {info.incentiveConfig && (
        <>
          <h2 style={headingStyle}>{t('Validator incentive config')}</h2>
          <SummaryBox>
            <section style={sectionStyle}>
              <CardSummary label={t('optimum self-stake')}>
                {info.incentiveConfig.optimumSelfStake.isZero()
                  ? <span style={{ opacity: 0.6 }}>{t('disabled')}</span>
                  : <FormatBalance value={info.incentiveConfig.optimumSelfStake} />
                }
              </CardSummary>
              <CardSummary label={t('hard cap')}>
                {info.incentiveConfig.hardCapSelfStake.isZero()
                  ? <span style={{ opacity: 0.6 }}>{t('disabled')}</span>
                  : <FormatBalance value={info.incentiveConfig.hardCapSelfStake} />
                }
              </CardSummary>
              <CardSummary label={t('slope factor')}>
                {formatPerbill(info.incentiveConfig.slopeFactor)}
              </CardSummary>
            </section>
          </SummaryBox>
        </>
      )}
      <EraPots
        activeEra={info.planningEra}
        historyDepth={info.historyDepth}
      />
    </>
  );
}

export default React.memo(Overview);
