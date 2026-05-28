// Copyright 2017-2026 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { AddressMini, CardSummary, SummaryBox, Table } from '@polkadot/react-components';
import { useViewFunction } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate.js';

interface EraPotRow {
  account: string;
  balance: string;
  era: string;
}

type TupleCodec = Record<number, { toString: () => string } | undefined>;

interface VecCodec {
  toArray?: () => unknown[];
}

function tupleStringAt (value: unknown, index: number): string | undefined {
  return (value as TupleCodec | undefined)?.[index]?.toString();
}

function toEraPotRows (result: unknown): EraPotRow[] {
  return ((result as VecCodec | undefined)?.toArray?.() ?? [])
    .map((entry): EraPotRow => ({
      account: tupleStringAt(entry, 1) ?? '',
      balance: tupleStringAt(entry, 2) ?? '',
      era: tupleStringAt(entry, 0) ?? ''
    }))
    .filter(({ account, balance, era }) => account && balance && era);
}

function Pots (): React.ReactElement {
  const { t } = useTranslation();

  // general_pot_balance() -> (AccountId, Balance)
  const generalPot = useViewFunction('Staking', 'general_pot_balance');
  // all_era_pot_balances() -> Vec<(EraIndex, AccountId, Balance)>
  const eraPotsResult = useViewFunction('Staking', 'all_era_pot_balances');

  const generalAccount = tupleStringAt(generalPot, 0);
  const generalBalance = tupleStringAt(generalPot, 1);
  const eraPots = useMemo(
    () => toEraPotRows(eraPotsResult),
    [eraPotsResult]
  );

  const headerRef = React.useRef<[React.ReactNode?, string?, number?][]>([
    [t('era'), 'number'],
    [t('pot account'), 'address'],
    [t('balance'), 'balances']
  ]);

  return (
    <>
      <SummaryBox>
        <section>
          <CardSummary label={t('General staker reward pot')}>
            {generalBalance
              ? <FormatBalance value={generalBalance} />
              : <span>-</span>
            }
          </CardSummary>
          {generalAccount && (
            <CardSummary label={t('Pot account')}>
              <AddressMini value={generalAccount} />
            </CardSummary>
          )}
        </section>
      </SummaryBox>
      <Table
        empty={eraPotsResult && eraPots.length === 0 && t('No era pots found')}
        header={headerRef.current}
      >
        {eraPots.map(({ account, balance, era }) => (
          <tr key={era}>
            <td className='number'>{era}</td>
            <td className='address'>
              <AddressMini value={account} />
            </td>
            <td className='number'>
              {balance
                ? <FormatBalance value={balance} />
                : '-'
              }
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}

export default React.memo(Pots);
