// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { Actions, ActionStatus } from '@polkadot/ui-app/Status/types';

import './index.css';

import React from 'react';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { Tabs } from '@polkadot/ui-app/index';
import { withMulti, withObservableBase } from '@polkadot/ui-react-rx/with/index';

import Creator from './Creator';
import Editor from './Editor';
import Restore from './Restore';
import translate from './translate';

type Props = I18nProps & {
  allAccounts?: SubjectInfo,
  onStatusChange: (status: ActionStatus) => void,
  basePath: string
};

type State = {
  action: Actions,
  hidden: Array<string>,
  items: Array<TabItem>
};

const Components: { [index: string]: React.ComponentType<any> } = {
  'create': Creator,
  'edit': Editor,
  'restore': Restore
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
    const { action, hidden, items } = this.state;
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
          onStatusChange={onStatusChange}
        />
      </main>
    );
  }

  private onMenuChange = (action: Actions) => {
    this.setState({ action });
  }

  private selectEdit = (): void => {
    this.setState({ action: 'edit' });
  }
}

export default withMulti(
  AccountsApp,
  translate,
  withObservableBase(accountObservable.subject, { propName: 'allAccounts' })
);
