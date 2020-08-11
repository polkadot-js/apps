// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StakerState } from '@polkadot/react-hooks/types';
import { UnappliedSlash } from '@polkadot/types/interfaces';
import { Slash } from './types';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import { CardSummary, SummaryBox, Table } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Row from './Row';

interface Props {
  ownStashes?: StakerState[];
  slashes: [BN, UnappliedSlash[]][];
}

interface SlashEra {
  era: BN;
  nominators: string[];
  payout: BN;
  reporters: string[];
  slashes: Slash[];
  validators: string[];
  total: BN;
}

function calcSlashEras (slashes: [BN, UnappliedSlash[]][], ownStashes: StakerState[]): SlashEra[] {
  const slashEras: SlashEra[] = [];

  slashes
    .reduce((rows: Slash[], [era, slashes]): Slash[] => {
      return slashes.reduce((rows: Slash[], slash): Slash[] => {
        const totalOther = slash.others.reduce((total: BN, [, value]): BN => {
          return total.add(value);
        }, new BN(0));

        const isMine = ownStashes.some(({ stashId }): boolean => {
          return slash.validator.eq(stashId) || slash.others.some(([nominatorId]) => nominatorId.eq(stashId));
        });

        rows.push({ era, isMine, slash, total: slash.own.add(totalOther), totalOther });

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
          reporters: [],
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

      slash.slash.reporters.forEach((accountId): void => {
        const reporterId = accountId.toString();

        if (slashEra && !slashEra.reporters.includes(reporterId)) {
          slashEra.reporters.push(reporterId);
        }
      });
    });

  return slashEras.sort((a, b) => b.era.cmp(a.era));
}

function Slashes ({ ownStashes = [], slashes }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const header = useMemo((): [string?, string?, number?][] => [
    [undefined, 'start', 3],
    [t('reporters'), 'address'],
    [t('own')],
    [t('other')],
    [t('total')],
    [t('payout')]
  ], [t]);
  const rows = useMemo(() => calcSlashEras(slashes, ownStashes), [ownStashes, slashes]);

  if (!rows.length) {
    return (
      <Table
        empty={t<string>('There are no unapplied/pending slashes')}
        header={[[t('unapplied'), 'start']]}
      />
    );
  }

  return (
    <>
      {rows.map(({ era, nominators, reporters, slashes, total, validators }): React.ReactNode => (
        <Table
          header={[[t('era {{era}}/unapplied', { replace: { era: era.toString() } }), 'start', 6]]}
          key={era.toString()}
        >
          <tr>
            <td colSpan={8}>
              <SummaryBox isSmall>
                <section>
                  <CardSummary label={t<string>('validators')}>
                    {formatNumber(validators.length)}
                  </CardSummary>
                  <CardSummary label={t<string>('nominators')}>
                    {formatNumber(nominators.length)}
                  </CardSummary>
                  <CardSummary label={t<string>('reporters')}>
                    {formatNumber(reporters.length)}
                  </CardSummary>
                </section>
                <section>
                  <CardSummary label={t<string>('total')}>
                    <FormatBalance value={total} />
                  </CardSummary>
                </section>
              </SummaryBox>
            </td>
          </tr>
          <tr>
            {header.map(([label, className, colSpan = 1], index): React.ReactNode => (
              <td
                className={className}
                colSpan={colSpan}
                key={index}
              >
                <label>{label}</label>
              </td>
            ))}
          </tr>
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
