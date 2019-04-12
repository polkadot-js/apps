// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { AccountFilter, ComponentProps } from './types';

import React from 'react';
import styled from 'styled-components';
import { Dropdown } from '@polkadot/ui-app';
import { getAddrName } from '@polkadot/ui-app/util';
import keyring from '@polkadot/ui-keyring';
import createOption from '@polkadot/ui-keyring/options/item';

import Account from './Account';
import translate from './translate';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

type Props = I18nProps & ComponentProps;

type State = {
  filter: AccountFilter,
  filterOptions: Array<{ text: React.ReactNode, value: AccountFilter }>
};

const Wrapper = styled.div`
  .accounts {
    display: flex;
    flex-wrap: wrap;

    .spacer {
      flex: 1 1;
      margin: .25rem;
      padding: 1rem 1.5rem;
    }
  }

  .filter {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.75rem;

    > div {
      max-width: 30rem;
    }
  }
`;

class Accounts extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      filter: 'all',
      filterOptions: [
        { text: t('Show all accounts'), value: 'all' },
        { text: t('Show all unbonded'), value: 'unbonded' },
        { text: t('Show only stashes'), value: 'stash' },
        { text: t('Show only controllers'), value: 'controller' }
      ]
    };
  }

  render () {
    const { balances, recentlyOffline, t, validators } = this.props;
    const { filter, filterOptions } = this.state;
    const accounts = keyring.getAccounts();

    return (
      <Wrapper>
        <div className='filter'>
          <Dropdown
            help={t('Select which types of accounts to display, either all, only the stash accounts or the controller accounts.')}
            label={t('filter')}
            onChange={this.onChangeFilter}
            options={filterOptions}
            value={filter}
          />
        </div>
        <div className='accounts'>
          {accounts.map((account) => {
            const address = account.address();
            const name = account.getMeta().name || '';

            return (
              <Account
                accountId={address}
                balances={balances}
                filter={filter}
                isValidator={validators.includes(address)}
                key={address}
                name={name}
                recentlyOffline={recentlyOffline}
                stashOptions={this.getStashOptions()}
                validators={validators}
              />
            );
          })}
          <div className='spacer' />
        </div>
      </Wrapper>
    );
  }

  private getStashOptions (): Array<KeyringSectionOption> {
    const { stashes } = this.props;

    return stashes.map((stashId) =>
      createOption(stashId, getAddrName(stashId))
    );
  }

  private onChangeFilter = (filter: AccountFilter): void => {
    this.setState({ filter });
  }
}

export default translate(Accounts);
