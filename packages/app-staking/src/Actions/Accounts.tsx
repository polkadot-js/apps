// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from '../types';

import React from 'react';
import { Button, CardGrid, Icon } from '@polkadot/ui-app';
import createOption from '@polkadot/ui-keyring/options/item';
import { getAddressName } from '@polkadot/ui-app/util';
import keyring from '@polkadot/ui-keyring';
import styled from 'styled-components';

import Account from './Account';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import StartStaking from './NewStake';
import translate from '../translate';

type Props = I18nProps & ComponentProps;

type State = {
  isNewStakeOpen: boolean
};

const Wrapper = styled(CardGrid) `
.ui--CardGrid-buttons {
  text-align: right;
}
`;

class Accounts extends React.PureComponent<Props,State> {
  state: State = {
    isNewStakeOpen: false
  };

  render () {
    const { recentlyOffline, t } = this.props;
    const accounts = keyring.getAccounts();
    const stashOptions = this.getStashOptions();

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
      >
        {this.renderNewStake()}
        {accounts.map(({ address }, index) => (
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

export default translate(Accounts);
