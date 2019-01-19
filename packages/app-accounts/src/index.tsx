// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { Actions } from '@polkadot/ui-app/Status/types';

import './index.css';

import React from 'react';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { Tabs } from '@polkadot/ui-app/index';
import { withMulti, withObservable } from '@polkadot/ui-api/index';

import Creator from './Creator';
import Editor from './Editor';
import Restore from './Restore';
import Vanity from './Vanity';
import translate from './translate';

type Props = AppProps & I18nProps & {
  allAccounts?: SubjectInfo
};

type State = {
  action: Actions,
  hidden: Array<string>,
  passthrough: string | null,
  items: Array<TabItem>
};

const Components: { [index: string]: React.ComponentType<any> } = {
  'create': Creator,
  'edit': Editor,
  'restore': Restore,
  'vanity': Vanity
};

class AccountsApp extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { allAccounts = {}, t } = props;
    const baseState = Object.keys(allAccounts).length !== 0
      ? AccountsApp.showEditState()
      : AccountsApp.hideEditState();

    this.state = {
      ...baseState,
      passthrough: null,
      items: [
        {
          name: 'edit',
          text: t('app.edit', { defaultValue: 'Edit account' })
        },
        {
          name: 'create',
          text: t('app.create', { defaultValue: 'Create account' })
        },
        {
          name: 'restore',
          text: t('app.restore', { defaultValue: 'Restore account' })
        },
        {
          name: 'vanity',
          text: t('app.vanity', { defaultValue: 'Vanity address' })
        }
      ]
    };
  }

  static showEditState () {
    return {
      action: 'edit' as Actions,
      hidden: []
    };
  }

  static hideEditState () {
    return {
      action: 'create' as Actions,
      hidden: ['edit']
    };
  }

  static getDerivedStateFromProps ({ allAccounts = {} }: Props, { hidden }: State) {
    const hasAddresses = Object.keys(allAccounts).length !== 0;

    if (hidden.length === 0) {
      return hasAddresses
        ? null
        : AccountsApp.hideEditState();
    }

    return hasAddresses
      ? AccountsApp.showEditState()
      : null;
  }

  render () {
    const { onStatusChange } = this.props;
    const { action, hidden, items, passthrough } = this.state;
    const Component = Components[action];

    return (
      <main className='accounts--App'>
        <header>
          <Tabs
            activeItem={action}
            hidden={hidden}
            items={items}
            onChange={this.onMenuChange}
          />
        </header>
        <Component
          onCreateAccount={this.selectEdit}
          onRestoreAccount={this.selectEdit}
          onCreateToggle={this.selectCreate}
          onStatusChange={onStatusChange}
          passthrough={passthrough}
        />
      </main>
    );
  }

  private onMenuChange = (action: Actions) => {
    this.setState({ action });
  }

  private selectCreate = (passthrough: string | null = null) => {
    this.setState({
      action: 'create',
      passthrough
    });
  }

  private selectEdit = (): void => {
    this.setState({
      action: 'edit',
      passthrough: null
    });
  }
}

export default withMulti(
  AccountsApp,
  translate,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
