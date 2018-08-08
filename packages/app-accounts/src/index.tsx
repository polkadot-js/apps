// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Navigation from '@polkadot/ui-app/Navigation';
import Page from '@polkadot/ui-app/Page';
import classes from '@polkadot/ui-app/util/classes';

import Creator from './Creator';
import Editor from './Editor';
import translate from './translate';

type Props = I18nProps & {};

type Actions = 'create' | 'edit';

type State = {
  action: Actions
};

// FIXME React-router would probably be the best route, not home-grown
const Components: { [index: string]: React.ComponentType<any> } = {
  'create': Creator,
  'edit': Editor
};

class AccountsApp extends React.PureComponent<Props, State> {
  state: State = { action: 'edit' };

  render () {
    const { className, style, t } = this.props;
    const { action } = this.state;
    const Component = Components[action];

    return (
      <Page
        className={classes('accounts--App', className)}
        style={style}
      >
        <Navigation>
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
          </Button.Group>
        </Navigation>
        <Component onBack={this.selectEdit} />
      </Page>
    );
  }

  selectCreate = (): void => {
    this.setState({ action: 'create' });
  }

  selectEdit = (): void => {
    this.setState({ action: 'edit' });
  }
}

export default translate(AccountsApp);
