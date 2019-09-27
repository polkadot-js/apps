// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { ComponentProps } from '../types';
import { I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { withCalls, withMulti } from '@polkadot/react-api/with';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, CardGrid } from '@polkadot/react-components';
import createOption from '@polkadot/ui-keyring/options/item';
import { getAddressName } from '@polkadot/react-components/util';

import Account from './Account';
import StartStaking from './NewStake';
import translate from '../translate';

interface Props extends I18nProps, ComponentProps, ApiProps {
  myControllers?: string[];
}

function getMyStashes (myControllers?: string[], allAccounts?: SubjectInfo): string[] | null {
  const result: string[] = [];

  if (!myControllers) {
    return null;
  }

  myControllers.forEach((value, index): void => {
    if (value.toString() !== '') {
      allAccounts && result.push(Object.keys(allAccounts)[index]);
    }
  });

  return result;
}

function Accounts ({ allAccounts, allStashes, className, myControllers, recentlyOnline, t }: Props): React.ReactElement<Props> {
  const [isNewStakeOpen, setIsNewStateOpen] = useState(false);
  const myStashes = getMyStashes(myControllers, allAccounts);
  const stashOptions = allStashes.map((stashId): KeyringSectionOption =>
    createOption(stashId, getAddressName(stashId, 'account'))
  );
  const isEmpty = !isNewStakeOpen && (!myStashes || myStashes.length === 0);

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
      {myStashes && myStashes.map((address, index): React.ReactNode => (
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

export default withMulti(
  styled(Accounts)`
    .ui--CardGrid-buttons {
      text-align: right;
    }
  `,
  translate,
  withCalls<Props>(
    ['query.staking.bonded', {
      isMulti: true,
      paramPick: ({ allAccounts }: Props): undefined | string[] => {
        return allAccounts && Object.keys(allAccounts);
      },
      propName: 'myControllers'
    }]
  )
);
