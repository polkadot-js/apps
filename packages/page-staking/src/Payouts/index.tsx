// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakerReward } from '@polkadot/api-derive/types';
import { PayoutStash, PayoutValidator } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Table } from '@polkadot/react-components';
import { useApi, useOwnEraRewards } from '@polkadot/react-hooks';

import ElectionBanner from '../ElectionBanner';
import { useTranslation } from '../translate';
import useStakerPayouts from './useStakerPayouts';
import PayButton from './PayButton';
import Stash from './Stash';
import Validator from './Validator';

interface Props {
  className?: string;
  isInElection?: boolean;
  stakerPayoutsAfter: BN;
}

interface Available {
  stashes?: PayoutStash[];
  validators?: PayoutValidator[];
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

              entry.available = entry.available.add(value);
            } else {
              grouped.push({
                available: value,
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
    }, [])
    .sort((a, b) => b.available.cmp(a.available));
}

function extractStashes (allRewards: Record<string, DeriveStakerReward[]>): PayoutStash[] {
  return Object
    .entries(allRewards)
    .map(([stashId, rewards]): PayoutStash => ({
      available: rewards.reduce((result, { total }) => result.iadd(total), new BN(0)),
      rewards,
      stashId
    }))
    .filter(({ available }) => !available.isZero())
    .sort((a, b) => b.available.cmp(a.available));
}

function Payouts ({ className, isInElection }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [{ stashes, validators }, setPayouts] = useState<Available>({});
  const stakerPayoutsAfter = useStakerPayouts();
  const { allRewards } = useOwnEraRewards();
  const { t } = useTranslation();

  useEffect((): void => {
    allRewards && setPayouts({
      stashes: extractStashes(allRewards),
      validators: groupByValidator(allRewards)
    });
  }, [allRewards]);

  return (
    <div className={className}>
      {api.tx.staking.payoutStakers && (
        <Button.Group>
          <PayButton
            isInElection={isInElection}
            payout={validators}
          />
        </Button.Group>
      )}
      <ElectionBanner isInElection={isInElection} />
      <Table
        empty={stashes && t('No pending payouts for your stashes')}
        header={[
          [t('payout/stash'), 'start'],
          [t('eras'), 'start'],
          [t('available')],
          [undefined, undefined, 3]
        ]}
        isFixed
      >
        {stashes?.map((payout): React.ReactNode => (
          <Stash
            isInElection={isInElection}
            key={payout.stashId}
            payout={payout}
            stakerPayoutsAfter={stakerPayoutsAfter}
          />
        ))}
      </Table>
      {api.tx.staking.payoutStakers && (
        <Table
          empty={validators && t('No pending era payouts from validators')}
          header={[
            [t('payout/validator'), 'start'],
            [t('eras'), 'start'],
            [t('total')],
            [undefined, undefined, 3]
          ]}
          isFixed
        >
          {validators?.map((payout): React.ReactNode => (
            <Validator
              isInElection={isInElection}
              key={payout.validatorId}
              payout={payout}
            />
          ))}
        </Table>
      )}
    </div>
  );
}

export default React.memo(styled(Payouts)`
  .payout-eras {
    padding-left: 0.25rem;
    vertical-align: middle;
  }
`);
