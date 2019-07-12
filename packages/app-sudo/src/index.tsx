/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { Icon, Tabs } from '@polkadot/ui-app';
import { withApi, withCalls, withMulti, withObservable } from '@polkadot/ui-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import SetKey from './SetKey';
import Sudo from './Sudo';

import translate from './translate';

type Props = AppProps & ApiProps & I18nProps & {
  allAccounts: SubjectInfo;
  sudo_key?: string;
};

interface State {
  isMine: boolean;
}

class App extends React.PureComponent<Props, State> {
  public state: State = {
    isMine: false
  };

  public static getDerivedStateFromProps ({ allAccounts = {}, sudo_key }: Props): State | null {
    return {
      isMine: !!sudo_key && !!Object.keys(allAccounts).find((key): boolean => key === sudo_key.toString())
    };
  }

  public render (): React.ReactNode {
    const { basePath, t } = this.props;
    const { isMine } = this.state;

    return (
      <main>
        <header>
          <Tabs
            basePath={basePath}
            items={[
              {
                isRoot: true,
                name: 'index',
                text: t('Sudo access')
              },
              {
                name: 'key',
                text: t('Set sudo key')
              }
            ]}
          />
        </header>
        {isMine ? (
          <Switch>
            <Route path={`${basePath}/key`} render={this.renderComponent(SetKey)} />
            <Route render={this.renderComponent(Sudo)} />
          </Switch>
        ) : (
          <article className='error padded'>
            <div>
              <Icon name='ban' />
              {t('You do not have access to the current sudo key')}
            </div>
          </article>
        )}
      </main>
    );
  }

  private renderComponent (Component: React.ComponentType<ComponentProps>) {
    return (): React.ReactNode => {
      const { allAccounts = {}, sudo_key: sudoKey = '' } = this.props;
      const { isMine } = this.state;

      return (
        <Component
          allAccounts={allAccounts}
          sudoKey={sudoKey}
          isMine={isMine}
        />
      );
    };
  }
}

export default withMulti(
  App,
  translate,
  withApi,
  withCalls<Props>(
    ['query.sudo.key', { transform: key => key.toString() }]
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
