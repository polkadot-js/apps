// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakerReward } from '@polkadot/api-derive/types';
import { PayoutValidator } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import Payout from './Payout';

interface Props {
  allRewards?: Record<string, DeriveStakerReward[]>;
  className?: string;
  stakerPayoutsAfter: BN;
}

function groupByValidator (allRewards: Record<string, DeriveStakerReward[]>): PayoutValidator[] {
  return Object
    .entries(allRewards)
    .reduce((grouped: PayoutValidator[], [stashId, rewards]): PayoutValidator[] => {
      rewards.forEach((reward: DeriveStakerReward): void => {
        Object
          .entries(reward.validators)
          .forEach(([validatorId, { value }]): void => {
            const entry = grouped.find((entry) => entry.validatorId === validatorId);

            if (entry) {
              const eraEntry = entry.eras.find((entry) => entry.era.eq(reward.era));

              if (eraEntry) {
                eraEntry.stashes[stashId] = value;
              } else {
                entry.eras.push({
                  era: reward.era,
                  stashes: { [stashId]: value }
                });
              }
            } else {
              grouped.push({
                eras: [{
                  era: reward.era,
                  stashes: { [stashId]: value }
                }],
                validatorId
              });
            }
          });
      });

      return grouped;
    }, []);
}

function Payouts ({ allRewards, className }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const [payouts, setPayouts] = useState<PayoutValidator[]>([]);
  const { t } = useTranslation();

  useEffect((): void => {
    allRewards && setPayouts(
      groupByValidator(allRewards)
    );
  }, [allRewards]);

  if (!api.tx.staking.stakerPayout) {
    return null;
  }

  return (
    <Table className={className}>
      <Table.Head>
        <th className='start'>
          <h1>{t('payouts/validator')}</h1>
        </th>
      </Table.Head>
      <Table.Body empty={t('No pending era payouts from validators')}>
        {payouts.map((payout): React.ReactNode => (
          <Payout
            key={payout.validatorId}
            payout={payout}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

export default React.memo(Payouts);
