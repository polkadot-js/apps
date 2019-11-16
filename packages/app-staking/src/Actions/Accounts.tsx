// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { AccountId, StakingLedger } from '@polkadot/types/interfaces';
import { ComponentProps } from '../types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, CardGrid } from '@polkadot/react-components';
import { trackStream, useApi } from '@polkadot/react-hooks';
import { AccountName } from '@polkadot/react-query';
import { Option } from '@polkadot/types';
import createOption from '@polkadot/ui-keyring/options/item';

import Account from './Account';
import StartStaking from './NewStake';
import translate from '../translate';

interface Props extends I18nProps, ComponentProps {
}

function getMyStashes (allAccounts: string[], queryBonded?: Option<AccountId>[], queryLedger?: Option<StakingLedger>[]): string[] | null {
  const result: string[] = [];

  if (!queryBonded || !queryLedger) {
    return null;
  }

  queryBonded.forEach((value, index): void => {
    value.isSome && result.push(allAccounts[index]);
  });

  queryLedger.forEach((ledger): void => {
    if (ledger.isSome) {
      const stashId = ledger.unwrap().stash.toString();

      !result.includes(stashId) && result.push(stashId);
    }
  });

  return result;
}

function Accounts ({ allAccounts, allStashes, className, recentlyOnline, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const queryBonded = trackStream<Option<AccountId>[]>(api.query.staking.bonded.multi as any, [allAccounts]);
  const queryLedger = trackStream<Option<StakingLedger>[]>(api.query.staking.ledger.multi as any, [allAccounts]);
  const [isNewStakeOpen, setIsNewStateOpen] = useState(false);
  const foundStashes = getMyStashes(allAccounts, queryBonded, queryLedger);
  const stashOptions = allStashes.map((stashId): KeyringSectionOption =>
    createOption(stashId, (<AccountName params={stashId} />) as any)
  );
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
      className={className}
      emptyText={t('No funds staked yet.')}
      isEmpty={isEmpty}
    >
      {isNewStakeOpen && (
        <StartStaking onClose={_toggleNewStake} />
      )}
      {foundStashes && foundStashes.map((address, index): React.ReactNode => (
        address && (
          <Account
            allStashes={allStashes}
            accountId={address}
            key={index}
            recentlyOnline={recentlyOnline}
            stashOptions={stashOptions}
          />
        )
      ))}
    </CardGrid>
  );
}

export default translate(
  styled(Accounts)`
    .ui--CardGrid-buttons {
      text-align: right;
    }
  `
);
