// Copyright 2017-2026 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary, SummaryBox, Table } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { useViewFunction } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

function Pots (): React.ReactElement {
  const { t } = useTranslation();

  // general_pot_balance() -> (AccountId, Balance)
  const generalPot = useViewFunction('Staking', 'general_pot_balance');
  // all_era_pot_balances() -> Vec<(EraIndex, AccountId, Balance)>
  const eraPotsResult = useViewFunction('Staking', 'all_era_pot_balances');

  const eraPotsHuman = eraPotsResult?.toHuman() as [string, string, string][] | undefined;

  let generalBalance: string | undefined;
  let generalAccount: string | undefined;

  try {
    generalAccount = (generalPot as any)?.[0]?.toString();
    generalBalance = (generalPot as any)?.[1]?.toString();
  } catch {
    // fallback
  }

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
              {generalAccount}
            </CardSummary>
          )}
        </section>
      </SummaryBox>
      <Table
        empty={eraPotsHuman && eraPotsHuman.length === 0 && t('No era pots found')}
        header={headerRef.current}
      >
        {eraPotsHuman && eraPotsHuman.map((entry, index) => (
          <tr key={index}>
            <td className='number'>{entry[0]}</td>
            <td className='address'>{entry[1]}</td>
            <td className='balances'>
              {(eraPotsResult as any)?.[index]?.[2]
                ? <FormatBalance value={(eraPotsResult as any)[index][2].toString()} />
                : entry[2]
              }
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}

export default React.memo(Pots);
