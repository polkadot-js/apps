// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import Button from '@polkadot/ui-app/Button';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';

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
  current: KeyringPair | null
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

    this.state = this.createState(null);
  }

  render () {
    const { accountAll, t } = this.props;
    const { action, current } = this.state;
    const Component = Components[action];

    console.log('index.tsx current.address(), accountAll: ', current && current.address(), accountAll);

    return (
      <main className='accounts--App'>
        <header>
          <Button.Group>
            <Button
              isPrimary={action === 'edit'}
              onClick={this.selectEdit}
              text={t('app.edit', {
                defaultValue: 'Edit account'
              })}
            />
            <Button.Or />
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
          accountAll={accountAll}
          current={current}
          onBack={this.selectEdit}
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

  createState (current: KeyringPair | null): State {
    return {
      action: 'edit',
      current
    };
  }
}

export default withObservableBase(
  accountObservable.subject, { propName: 'accountAll' }
)(translate(AccountsApp));
