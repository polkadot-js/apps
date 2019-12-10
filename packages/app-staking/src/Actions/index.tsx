// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, StakingLedger } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, CardGrid } from '@polkadot/react-components';
import { useCall, useApi, useAccounts } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import Account from './Account';
import StartStaking from './NewStake';
import translate from '../translate';

interface Props extends I18nProps {
  allStashes: string[];
  isVisible: boolean;
  recentlyOnline?: DerivedHeartbeats;
  next: string[];
  stakingOverview?: DerivedStakingOverview;
}

function getStashes (allAccounts: string[], queryBonded?: Option<AccountId>[], queryLedger?: Option<StakingLedger>[]): [string, boolean][] | null {
  const result: [string, boolean][] = [];

  if (!queryBonded || !queryLedger) {
    return null;
  }

  queryBonded.forEach((value, index): void => {
    value.isSome && result.push([allAccounts[index], true]);
  });

  queryLedger.forEach((ledger): void => {
    if (ledger.isSome) {
      const stashId = ledger.unwrap().stash.toString();

      !result.some(([accountId]): boolean => accountId === stashId) && result.push([stashId, false]);
    }
  });

  return result;
}

function Actions ({ allStashes, className, isVisible, next, recentlyOnline, stakingOverview, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const queryBonded = useCall<Option<AccountId>[]>(api.query.staking.bonded.multi as any, [allAccounts]);
  const queryLedger = useCall<Option<StakingLedger>[]>(api.query.staking.ledger.multi as any, [allAccounts]);
  const [isNewStakeOpen, setIsNewStateOpen] = useState(false);
  const [foundStashes, setFoundStashes] = useState<[string, boolean][] | null>(null);

  useEffect((): void => {
    setFoundStashes(getStashes(allAccounts, queryBonded, queryLedger));
  }, [allAccounts, queryBonded, queryLedger]);

  const isEmpty = !isNewStakeOpen && (!foundStashes || foundStashes.length === 0);
  const _toggleNewStake = (): void => setIsNewStateOpen(!isNewStakeOpen);

  return (
    <CardGrid
      buttons={
        <Button
          isPrimary
          key='new-stake'
          label={t('New stake')}
          icon='add'
          onClick={_toggleNewStake}
        />
      }
      className={`${className} ${!isVisible && 'staking--hidden'}`}
      emptyText={t('No funds staked yet.')}
      isEmpty={isEmpty}
    >
      {isNewStakeOpen && (
        <StartStaking onClose={_toggleNewStake} />
      )}
      {foundStashes?.map(([stashId, isOwnStash], index): React.ReactNode => (
        stashId && (
          <Account
            allStashes={allStashes}
            isOwnStash={isOwnStash}
            key={index}
            next={next}
            recentlyOnline={recentlyOnline}
            stakingOverview={stakingOverview}
            stashId={stashId}
          />
        )
      ))}
    </CardGrid>
  );
}

export default translate(
  styled(Actions)`
    .ui--CardGrid-buttons {
      text-align: right;
    }
  `
);
