// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import keyring from '@polkadot/ui-keyring/index';
import Tabs from '@polkadot/ui-app/Tabs';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';

import { isNoAccounts } from './util/accounts';
import Creator from './Creator';
import Editor from './Editor';
import Restorer from './Restorer';
import translate from './translate';

type Props = I18nProps & {
  accountAll?: Array<any>,
  basePath: string
};

type Actions = 'create' | 'edit' | 'restore';

type State = {
  action: Actions,
  current: KeyringPair | null,
  editedName: string,
  isEdited: boolean
  previous: KeyringPair | null
};

// FIXME React-router would probably be the best route, not home-grown
const Components: { [index: string]: React.ComponentType<any> } = {
  'create': Creator,
  'edit': Editor,
  'restore': Restorer
};

class AccountsApp extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.createState(null, null);
  }

  componentDidUpdate () {
    const { accountAll } = this.props;
    const { action } = this.state;

    // Show Restorer tab instead of Editor tab when no accounts exist
    if (action === 'edit' && isNoAccounts(accountAll)) {
      this.selectRestore();
    }
  }

  render () {
    const { accountAll, t } = this.props;
    const { action, current, editedName, isEdited, previous } = this.state;
    const Component = Components[action];
    const items = [
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
    ];

    // Do not load Editor tab if no accounts
    if (isNoAccounts(accountAll)) {
      items.splice(0, 1);
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
          accountAll={accountAll}
          current={current}
          editedName={editedName}
          isEdited={isEdited}
          onChangeAccount={this.onChangeAccount}
          onCreate={this.onCreatorCreate}
          onChangeName={this.onEditorChangeName}
          onCommit={this.onEditorCommit}
          onDiscard={this.onEditorDiscard}
          onForget={this.onEditorForget}
          previous={previous}
        />
      </main>
    );
  }

  onMenuChange = (action: Actions) => {
    this.setState({ action });
  }

  selectEdit = (): void => {
    this.setState({ action: 'edit' });
  }

  selectRestore = (): void => {
    this.setState({ action: 'restore' });
  }

  createState (current: KeyringPair | null, previous: KeyringPair | null): State {
    return {
      action: 'edit',
      current,
      editedName: current ? current.getMeta().name || '' : '',
      isEdited: false,
      previous
    };
  }

  onChangeAccount = (publicKey: Uint8Array): void => {
    const current = publicKey && publicKey.length === 32
      ? keyring.getPair(publicKey)
      : null;

    this.nextState({
      current
    } as State);

    this.selectEdit();
  }

  onCreatorCreate = (publicKey: Uint8Array): void => {
    const current = publicKey && publicKey.length === 32
      ? keyring.getPair(publicKey)
      : null;

    this.nextState({
      current
    } as State);

    this.selectEdit();
  }

  onEditorChangeName = (editedName: string): void => {
    this.nextState({ editedName } as State);
  }

  onEditorCommit = (): void => {
    const { current } = this.state;
    const { editedName } = this.state;

    if (!current) {
      return;
    }

    keyring.saveAccountMeta(current, {
      name: editedName,
      whenEdited: Date.now()
    });

    this.nextState({} as State);
  }

  onEditorDiscard = (): void => {
    const { current } = this.state;

    if (!current) {
      return;
    }

    this.nextState({
      editedName: current.getMeta().name
    } as State);
  }

  onEditorForget = (): void => {
    const { current } = this.state;

    if (!current) {
      return;
    }

    this.setState(
      this.createState(null, null),
      () => {
        keyring.forgetAccount(
          current.address()
        );
      }
    );
  }

  nextState (newState: State = {} as State): void {
    this.setState(
      (prevState: State): State => {
        let {
          action = prevState.action,
          current = prevState.current,
          editedName = prevState.editedName
        } = newState;

        const previous = prevState.current || null;
        const previousPair = previous || { address: () => undefined };
        let isEdited = false;

        if (current) {
          if (current.address() !== previousPair.address()) {
            editedName = current.getMeta().name || '';
          } else if (editedName !== current.getMeta().name) {
            isEdited = true;
          }
        } else {
          editedName = '';
        }

        return {
          action: action,
          current,
          editedName,
          isEdited,
          previous
        };
      }
    );
  }
}

export default withObservableBase(
  accountObservable.subject, { propName: 'accountAll' }
)(translate(AccountsApp));
