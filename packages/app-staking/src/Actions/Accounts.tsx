// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from '../types';
import { ApiProps } from '@polkadot/ui-api/types';
import { withApi, withMulti } from '@polkadot/ui-api/with';

import React from 'react';
import styled from 'styled-components';
import { Button, CardGrid, Icon } from '@polkadot/ui-app';
import createOption from '@polkadot/ui-keyring/options/item';
import { getAddressName } from '@polkadot/ui-app/util';

import Account from './Account';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import StartStaking from './NewStake';
import translate from '../translate';

type Props = I18nProps & ComponentProps & ApiProps;

type State = {
  isNewStakeOpen: boolean,
  myStashes: Array<string | null> | undefined
};

const Wrapper = styled(CardGrid) `
.ui--CardGrid-buttons {
  text-align: right;
}
`;

class Accounts extends React.PureComponent<Props,State> {
  state: State = {
    isNewStakeOpen: false,
    myStashes: []
  };

  async componentWillReceiveProps ({ allAccounts, api }: Props, { isNewStakeOpen }: State) {
    const stashes = allAccounts && Object.keys(allAccounts).map((account) => {
      return (
        api.query.staking.bonded(account)
        .then((myControler) => {
          if (myControler.toString() !== '') {
            return account;
          } else {
            return null;
          }
        })
      );
    });

    const myStashes = stashes && await Promise.all(stashes)
    .then((stashes) => {
      return stashes.filter((stash) => stash !== null);
    });

    this.setState({
      isNewStakeOpen,
      myStashes
    });
  }

  render () {
    const { recentlyOffline, t } = this.props;
    const { isNewStakeOpen, myStashes } = this.state;
    const stashOptions = this.getStashOptions();
    const isEmpty = !isNewStakeOpen && (!myStashes || myStashes.length === 0);

    return (
      <Wrapper
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
      </Wrapper>
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
  Accounts,
  translate,
  withApi
);
