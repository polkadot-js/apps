// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import Tabs from '@polkadot/ui-app/Tabs';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';

import { isAccounts, hasNoAccounts } from './util/accounts';
import Creator from './Creator';
import Editor from './Editor';
import Restorer from './Restorer';
import translate from './translate';

type Props = I18nProps & {
  allAccounts?: Array<Object>,
  basePath: string
};

type Actions = 'create' | 'edit' | 'restore';

type State = {
  action: Actions,
  isLoading: boolean
};

// FIXME React-router would probably be the best route, not home-grown
const Components: { [index: string]: React.ComponentType<any> } = {
  'create': Creator,
  'edit': Editor,
  'restore': Restorer
};

class AccountsApp extends React.PureComponent<Props, State> {
  state: State = {
    action: 'edit',
    isLoading: true
  };

  componentDidMount () {
    this.setState({ isLoading: false });
  }

  componentDidUpdate () {
    const { allAccounts } = this.props;
    const { action } = this.state;

    if (action === 'edit' && hasNoAccounts(allAccounts)) {
      this.selectCreate();
    }
  }

  render () {
    const { allAccounts, t } = this.props;
    const { action, isLoading } = this.state;
    const Component = Components[action];
    const items = [
      {
        name: 'create',
        text: t('app.create', { defaultValue: 'Create account' })
      },
      {
        name: 'restore',
        text: t('app.restore', { defaultValue: 'Restore account' })
      }
    ];
    const editItem = {
      name: 'edit',
      text: t('app.edit', { defaultValue: 'Edit account' })
    };

    // Prepend Editor tab if any accounts exist
    if (isAccounts(allAccounts)) {
      items.unshift(editItem);
    }

    if (isLoading) {
      return null;
    }

    return (
      <main className='accounts--App'>
        <header>
          <Tabs
            activeItem={action}
            items={items}
            onChange={this.onMenuChange}
          />
        </header>
        <Component
          onChangeAccount={this.onChangeAccount}
          onCreateAccount={this.onCreateAccount}
        />
      </main>
    );
  }

  onChangeAccount = () => {
    this.selectEdit();
  }

  onCreateAccount = () => {
    this.selectEdit();
  }

  onMenuChange = (action: Actions) => {
    this.setState({ action });
  }

  selectCreate = (): void => {
    this.setState({ action: 'create' });
  }

  selectEdit = (): void => {
    this.setState({ action: 'edit' });
  }

  selectRestore = (): void => {
    this.setState({ action: 'restore' });
  }
}

export default withObservableBase(
  accountObservable.subject, { propName: 'allAccounts' }
)(translate(AccountsApp));
