// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import styled from 'styled-components';
import { Dropdown, FilterOverlay } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import Account from './Account';
import translate from './translate';

type Props = I18nProps;

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
`;

class Delegations extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      filter: 'all',
      filterOptions: [
        { text: t('Show all accounts'), value: 'all' },
        { text: t('Show only delegates'), value: 'delegates' },
        { text: t('Show only delegators'), value: 'delegators' }
      ]
    };
  }

  render () {
    const { t } = this.props;
    const { filter, filterOptions } = this.state;
    const accounts = keyring.getAccounts();

    return (
      <Wrapper>
        <FilterOverlay>
          <Dropdown
            help={t('Select which types of accounts to display, either all, only the delegate accounts or the delegator accounts.')}
            label={t('filter')}
            onChange={this.onChangeFilter}
            options={filterOptions}
            value={filter}
          />
        </FilterOverlay>
        <div className='accounts'>
          {accounts.map((account) => {
            const address = account.address();
            const name = account.getMeta().name || '';

            return (
              <Account
                accountId={address}
                filter={filter}
                key={address}
                name={name}
              />
            );
          })}
          <div className='spacer' />
        </div>
      </Wrapper>
    );
  }

  private onChangeFilter = (filter: AccountFilter): void => {
    this.setState({ filter });
  }
}

export default translate(Delegations);
