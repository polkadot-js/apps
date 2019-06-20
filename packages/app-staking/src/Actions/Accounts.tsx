// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { ComponentProps } from '../types';
import { I18nProps } from '@polkadot/ui-app/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { withApi, withMulti } from '@polkadot/ui-api/with';

import React from 'react';
import styled from 'styled-components';
import { Button, CardGrid, Icon } from '@polkadot/ui-app';
import createOption from '@polkadot/ui-keyring/options/item';
import { getAddressName } from '@polkadot/ui-app/util';

import Account from './Account';
import StartStaking from './NewStake';
import translate from '../translate';

type Props = I18nProps & ComponentProps & ApiProps;

type State = {
  allAccounts: SubjectInfo | undefined;
  isNewStakeOpen: boolean,
  myStashes: Array<string | null> | undefined
};

class Accounts extends React.PureComponent<Props,State> {
  state: State = {
    allAccounts: undefined,
    isNewStakeOpen: false,
    myStashes: []
  };

  componentWillReceiveProps ({ allAccounts, api }: Props) {
    const previousState = this.state;

    if (allAccounts && allAccounts !== previousState.allAccounts) {
      api.query.staking.bonded.multi(Object.keys(allAccounts))
      .then((myControlers) => {
        const result: string[] = [];

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
      .catch((e) => {
        console.error(e);
      });
    }
  }

  render () {
    const { className, recentlyOffline, t } = this.props;
    const { isNewStakeOpen, myStashes } = this.state;
    const stashOptions = this.getStashOptions();
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
  withApi
);
