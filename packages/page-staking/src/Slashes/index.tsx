// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnappliedSlash } from '@polkadot/types/interfaces';
import { Slash } from './types';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import { Table } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Row from './Row';

interface Props {
  slashes: [BN, UnappliedSlash[]][];
}

interface SlashEra {
  era: BN;
  nominators: string[];
  payout: BN;
  slashes: Slash[];
  validators: string[];
  total: BN;
}

function Slashes ({ slashes }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const header = useMemo(() => [
    [],
    [t('own')],
    [t('other')],
    [t('total')],
    [t('reporters'), 'address'],
    [t('payout')]
  ], [t]);
  const rows = useMemo((): SlashEra[] => {
    const slashEras: SlashEra[] = [];

    slashes
      .reduce((rows: Slash[], [era, slashes]): Slash[] => {
        return slashes.reduce((rows: Slash[], slash): Slash[] => {
          const totalOther = slash.others.reduce((total: BN, [, value]): BN => {
            return total.add(value);
          }, new BN(0));

          rows.push({ era, slash, total: slash.own.add(totalOther), totalOther });

          return rows;
        }, rows);
      }, [])
      .forEach((slash): void => {
        let slashEra = slashEras.find(({ era }) => era.eq(slash.era));

        if (!slashEra) {
          slashEra = {
            era: slash.era,
            nominators: [],
            payout: new BN(0),
            slashes: [],
            total: new BN(0),
            validators: []
          };
          slashEras.push(slashEra);
        }

        slashEra.payout.iadd(slash.slash.payout);
        slashEra.total.iadd(slash.total);
        slashEra.slashes.push(slash);

        const validatorId = slash.slash.validator.toString();

        if (!slashEra.validators.includes(validatorId)) {
          slashEra.validators.push(validatorId);
        }

        slash.slash.others.forEach(([accountId]): void => {
          const nominatorId = accountId.toString();

          if (slashEra && !slashEra.nominators.includes(nominatorId)) {
            slashEra.nominators.push(nominatorId);
          }
        });
      });

    return slashEras.sort((a, b) => b.era.cmp(a.era));
  }, [slashes]);

  if (!rows.length) {
    return <article>{t('There are no unapplied/pending slashes')}</article>;
  }

  return (
    <>
      {rows.map(({ era, payout, slashes, total, validators }): React.ReactNode => (
        <Table
          footer={
            <tr>
              <td>{formatNumber(validators.length)}</td>
              <td colSpan={3} />
              <td><FormatBalance value={total} /></td>
              <td />
              <td><FormatBalance value={payout} /></td>
            </tr>
          }
          header={[[t('era {{era}}/unapplied', { replace: { era: era.toString() } }), 'start']].concat(header)}
          key={era.toString()}
        >
          {slashes.map((slash, index): React.ReactNode => (
            <Row
              key={index}
              slash={slash}
            />
          ))}
        </Table>
      ))}
    </>
  );
}

export default React.memo(Slashes);
