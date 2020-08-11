// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnappliedSlash } from '@polkadot/types/interfaces';
import { Slash } from './types';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Row from './Row';

interface Props {
  slashes: [BN, UnappliedSlash[]][];
}

function Slashes ({ slashes }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const header = useMemo(() => [
    [t('unapplied slashes'), 'start', 3],
    [t('own')],
    [t('other')],
    [t('total')],
    [t('reporters'), 'start'],
    [t('payout')],
    [t('era cumulative')]
  ], [t]);
  const rows = useMemo((): Slash[] => {
    const rows = slashes
      .reduce((rows: Slash[], [era, slashes]): Slash[] => {
        return slashes.reduce((rows: Slash[], slash): Slash[] => {
          const totalOther = slash.others.reduce((total: BN, [, value]): BN => {
            return total.add(value);
          }, new BN(0));

          const total = slash.own.add(totalOther);

          rows.push({ cumulative: total, era, slash, total, totalOther });

          return rows;
        }, rows);
      }, [])
      .sort((a, b) => b.era.cmp(a.era));

    rows.forEach((row, index): void => {
      const prev = rows[index - 1];

      if (prev && prev.era.eq(row.era)) {
        row.cumulative = row.cumulative.add(prev.cumulative);
      }
    });

    return rows;
  }, [slashes]);

  return (
    <Table
      empty={t<string>('There an no unapplied/pending slashes')}
      header={header}
    >
      {rows.map((slash, index): React.ReactNode => (
        <Row
          key={`${index}-${slash.era.toString()}`}
          slash={slash}
          withEra={index === 0 || !slash.era.eq(rows[index - 1].era)}
        />
      ))}
    </Table>
  );
}

export default React.memo(Slashes);
