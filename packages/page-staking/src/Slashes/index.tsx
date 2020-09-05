// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StakerState } from '@polkadot/react-hooks/types';
import { UnappliedSlash } from '@polkadot/types/interfaces';
import { Slash, SlashEra } from './types';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import { Table } from '@polkadot/react-components';
import { useAccounts, useApi, useMembers } from '@polkadot/react-hooks';
import { getSlashThreshold } from '@polkadot/app-council/thresholds';

import { useTranslation } from '../translate';
import Era from './Era';

interface Props {
  ownStashes?: StakerState[];
  slashes: [BN, UnappliedSlash[]][];
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
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const { members } = useMembers();

  const rows = useMemo(
    () => calcSlashEras(slashes, ownStashes),
    [ownStashes, slashes]
  );

  const councilId = useMemo(
    () => allAccounts.find((accountId) => members.includes(accountId)) || null,
    [allAccounts, members]
  );

  if (!rows.length) {
    return (
      <Table
        empty={t<string>('There are no unapplied/pending slashes')}
        header={[[t('unapplied'), 'start']]}
      />
    );
  }

  const councilThreshold = Math.ceil((members.length || 0) * getSlashThreshold(api));

  return (
    <>
      {rows.map((slash): React.ReactNode => (
        <Era
          councilId={councilId}
          councilThreshold={councilThreshold}
          key={slash.era.toString()}
          slash={slash}
        />
      ))}
    </>
  );
}

export default React.memo(Slashes);
