// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { ComponentProps } from '../types';
import { I18nProps } from '@polkadot/ui-app/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { withApi, withCalls, withMulti } from '@polkadot/ui-api/with';

import React from 'react';
import styled from 'styled-components';
import { Button, CardGrid, Icon } from '@polkadot/ui-app';
import createOption from '@polkadot/ui-keyring/options/item';
import { getAddressName } from '@polkadot/ui-app/util';

import Account from './Account';
import StartStaking from './NewStake';
import translate from '../translate';

type Props = I18nProps & ComponentProps & ApiProps & {
  myControllers?: Array<string>
};

type State = {
  isNewStakeOpen: boolean
};

class Accounts extends React.PureComponent<Props,State> {
  state: State = {
    isNewStakeOpen: false
  };
/*
  componentWillReceiveProps ({ allAccounts, myControllers }: Props) {

    if (allAccounts && allAccounts !== previousState.allAccounts) {
        myControlers.forEach((value,index) => {

          if (value.toString() !== '') {
            result.push(Object.keys(allAccounts)[index]);
          }
        });

        return result;
      })
      .then((myStashes) => {
        this.setState({
          isNewStakeOpen: previousState.isNewStakeOpen,
          allAccounts,
          myStashes
        });
      })
      .catch(console.error);
    }
  }
*/

  render () {
    const { className, myControllers, recentlyOffline, t } = this.props;
    const { isNewStakeOpen } = this.state;
    const stashOptions = this.getStashOptions();
    const myStashes = this.getMyStashes();
    const isEmpty = !isNewStakeOpen && (!myStashes || myStashes.length === 0);

    console.log('myControllers',myControllers);
    console.log('myStashes',myStashes);

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
        {myStashes && myStashes.map((address, index) => (
          address &&
          <Account
            accountId={address}
            key={index}
            recentlyOffline={recentlyOffline}
            stashOptions={stashOptions}
          />
        ))}
      </CardGrid>
    );
  }

  private getMyStashes () {
    const { myControllers, allAccounts } = this.props;
    const result: Array<string> = [];

    if (!myControllers) {
      return null;
    }

    myControllers.forEach((value,index) => {
      if (value.toString() !== '') {
        allAccounts && result.push(Object.keys(allAccounts)[index]);
      }
    });

    return result;
  }

  private renderNewStake () {
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
    this.setState(({ isNewStakeOpen }) => ({
      isNewStakeOpen: !isNewStakeOpen
    }));
  }

  private getStashOptions (): Array<KeyringSectionOption> {
    const { stashes } = this.props;

    return stashes.map((stashId) =>
      createOption(stashId, getAddressName(stashId, 'account'))
    );
  }
}

export default withMulti(
  styled(Accounts)`
    .ui--CardGrid-buttons {
      text-align: right;
    }
  `,
  translate,
  withApi,
  withCalls<Props>(
    'derive.staking.controllers',
    'query.session.validators',
    'query.staking.recentlyOffline',
    ['query.staking.bonding', {
      isMulti: true,
      paramPick: ({ allAccounts }: Props) => allAccounts && Object.keys(allAccounts)
    }]
  )
);
