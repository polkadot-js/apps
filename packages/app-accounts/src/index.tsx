// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import Button from '@polkadot/ui-app/Button';
import keyring from '@polkadot/ui-keyring/index';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';

import { isAccounts, isNoAccounts } from './util/accounts';
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

    if (action === 'edit' && isNoAccounts(accountAll)) {
      this.selectRestore();
    }
  }

  render () {
    const { accountAll, t } = this.props;
    const { action, current, previous } = this.state;
    const Component = Components[action];

    console.log('current: ', current);
    console.log('accountAll: ', accountAll);
    console.log('isAccounts(accountAll): ', isAccounts(accountAll));
    console.log('isNoAccounts(accountAll): ', isNoAccounts(accountAll));

    return (
      <main className='accounts--App'>
        <header>
          <Button.Group>
            {
              isAccounts(accountAll)
                ? <Button
                    isPrimary={action === 'edit'}
                    onClick={this.selectEdit}
                    text={t('app.edit', {
                      defaultValue: 'Edit account'
                    })}
                  />
                : null
            }
            {
              isAccounts(accountAll)
                ? <Button.Or />
                : null
            }
            <Button
              isPrimary={action === 'create'}
              onClick={this.selectCreate}
              text={t('app.create', {
                defaultValue: 'Create account'
              })}
            />
            <Button.Or />
            <Button
              isPrimary={action === 'restore'}
              onClick={this.selectRestore}
              text={t('app.restore', {
                defaultValue: 'Restore account'
              })}
            />
          </Button.Group>
        </header>
        <Component
          current={current}
          onChangeAccount={this.onChangeAccount}
          onCreateAccount={this.onCreateAccount}
          onForget={this.onForget}
          previous={previous}
        />
      </main>
    );
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

  createState (current: KeyringPair | null, previous: KeyringPair | null): State {
    return {
      action: 'edit',
      current,
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

  onCreateAccount = (publicKey: Uint8Array): void => {
    const current = publicKey && publicKey.length === 32
      ? keyring.getPair(publicKey)
      : null;

    this.nextState({
      current
    } as State);

    this.selectEdit();
  }

  onForget = (): void => {
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
        let { action = prevState.action, current = prevState.current } = newState;
        const previous = prevState.current || null;

        return {
          action: action,
          current,
          previous
        };
      }
    );
  }
}

export default withObservableBase(
  accountObservable.subject, { propName: 'accountAll' }
)(translate(AccountsApp));
