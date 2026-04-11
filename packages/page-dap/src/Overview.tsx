// Copyright 2017-2026 @polkadot/app-dap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox, Table } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { useApi, useViewFunction } from '@polkadot/react-hooks';

import { useTranslation } from './translate.js';

function formatCadence (ms: number): string {
  if (ms === 0) {
    return 'every block';
  }

  const seconds = Math.floor(ms / 1_000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remMin = minutes % 60;

    return remMin > 0 ? `every ${hours}h ${remMin}m` : `every ${hours}h`;
  }

  if (minutes > 0) {
    const remSec = seconds % 60;

    return remSec > 0 ? `every ${minutes}m ${remSec}s` : `every ${minutes}m`;
  }

  return `every ${seconds}s`;
}

function Overview (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();

  // buffer_balance() -> (AccountId, Balance)
  const bufferResult = useViewFunction('Dap', 'buffer_balance');
  // budgets() -> Vec<(BudgetKey, AccountId, Perbill, Balance)>
  const budgetsResult = useViewFunction('Dap', 'budgets');

  const bufferHuman = bufferResult?.toHuman() as [string, string] | undefined;
  const budgetsHuman = budgetsResult?.toHuman() as [string, string, string, string][] | undefined;

  const cadenceLabel = useMemo((): string | undefined => {
    try {
      const cadenceMs = (api.consts.dap as any)?.issuanceCadence;

      if (cadenceMs) {
        return formatCadence(cadenceMs.toNumber());
      }
    } catch {
      // constant not available
    }

    return undefined;
  }, [api]);

  const headerRef = React.useRef<[React.ReactNode?, string?, number?][]>([
    [t('budget key'), 'start'],
    [t('pot account'), 'address'],
    [t('allocation'), 'number'],
    [t('balance'), 'balances']
  ]);

  // Extract the raw balance from the tuple for FormatBalance
  let bufferBalance: string | undefined;

  try {
    bufferBalance = (bufferResult as any)?.[1]?.toString();
  } catch {
    // fallback
  }

  return (
    <>
      <SummaryBox>
        <section>
          <CardSummary label={t('DAP buffer balance')}>
            {bufferBalance
              ? <FormatBalance value={bufferBalance} />
              : <span>-</span>
            }
          </CardSummary>
          {cadenceLabel && (
            <CardSummary label={t('Minting cadence')}>
              {cadenceLabel}
            </CardSummary>
          )}
        </section>
      </SummaryBox>
      <Table
        empty={budgetsHuman && budgetsHuman.length === 0 && t('No budget recipients found')}
        header={headerRef.current}
      >
        {budgetsHuman && budgetsHuman.map((entry, index) => (
          <tr key={index}>
            <td className='start'>{entry[0]}</td>
            <td className='address'>{entry[1]}</td>
            <td className='number'>{entry[2]}</td>
            <td className='balances'>
              {(budgetsResult as any)?.[index]?.[3]
                ? <FormatBalance value={(budgetsResult as any)[index][3].toString()} />
                : entry[3]
              }
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}

export default React.memo(Overview);
