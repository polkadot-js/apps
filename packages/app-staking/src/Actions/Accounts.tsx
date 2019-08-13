// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { ComponentProps } from '../types';
import { I18nProps } from '@polkadot/react-components/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { withCalls, withMulti } from '@polkadot/react-api/with';

import React from 'react';
import styled from 'styled-components';
import { Button, CardGrid, Icon } from '@polkadot/react-components';
import createOption from '@polkadot/ui-keyring/options/item';
import { getAddressName } from '@polkadot/react-components/util';

import Account from './Account';
import StartStaking from './NewStake';
import translate from '../translate';

type Props = I18nProps & ComponentProps & ApiProps & {
  myControllers?: string[];
};

interface State {
  isNewStakeOpen: boolean;
}

class Accounts extends React.PureComponent<Props, State> {
  public state: State = {
    isNewStakeOpen: false
  };

  public render (): React.ReactNode {
    const { allStashes, className, recentlyOnline, t } = this.props;
    const { isNewStakeOpen } = this.state;
    const stashOptions = this.getStashOptions();
    const myStashes = this.getMyStashes();
    const isEmpty = !isNewStakeOpen && (!myStashes || myStashes.length === 0);

    return (
      <CardGrid
        buttons={
          <Button
            isPrimary
            key='new-stake'
            label={
              <>
                <Icon name='add'/>
                {t('New stake')}
              </>
            }
            onClick={this.toggleNewStake}
          />
        }
        className={className}
        emptyText={t('No funds staked yet.')}
        isEmpty={isEmpty}
      >
        {this.renderNewStake()}
        {myStashes && myStashes.map((address, index): React.ReactNode => (
          address &&
          <Account
            allStashes={allStashes}
            accountId={address}
            key={index}
            recentlyOnline={recentlyOnline}
            stashOptions={stashOptions}
          />
        ))}
      </CardGrid>
    );
  }

  private getMyStashes (): string[] | null {
    const { myControllers, allAccounts } = this.props;
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

  private getStashOptions (): KeyringSectionOption[] {
    const { allStashes } = this.props;

    return allStashes.map((stashId): KeyringSectionOption =>
      createOption(stashId, getAddressName(stashId, 'account'))
    );
  }

  private renderNewStake (): React.ReactNode {
    const { isNewStakeOpen } = this.state;

    if (!isNewStakeOpen) {
      return null;
    }

    return (
      <StartStaking
        onClose={this.toggleNewStake}
      />
    );
  }

  private toggleNewStake = (): void => {
    this.setState(({ isNewStakeOpen }): Pick<State, never> => ({
      isNewStakeOpen: !isNewStakeOpen
    }));
  }
}

export default withMulti(
  styled(Accounts as React.ComponentClass<Props, State>)`
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
