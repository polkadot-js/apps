// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// some types, AppProps for the app and I18nProps to indicate
// translatable strings. Generally the latter is quite "light",
// `t` is inject into props (see the HOC export) and `t('any text')
// does the translation
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { AccountId } from '@polkadot/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

// external imports (including those found in the packages/*
// of this repo)
import React from 'react';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import { withCalls, withMulti, withObservable } from '@polkadot/ui-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

// our app-specific styles
import './index.css';

// local imports and components
import KeySelector from './KeySelector';
import SummaryBar from './SummaryBar';
import Transfer from './Transfer';
import translate from './translate';

// define out internal types
type Props = AppProps & I18nProps & {
  allAccounts?: SubjectInfo,
  sudo_key?: AccountId | string
};

type State = {
  isMine: boolean
};

class App extends React.PureComponent<Props, State> {

  static getDerivedStateFromProps ({ allAccounts = {}, sudo_key }: Props): State | null {
    console.log(sudo_key);
    return {
      isMine: !!sudo_key && !!Object.keys(allAccounts).find((key) => key === sudo_key.toString())
    };
  }

  render () {
    const { basePath, sudo_key: sudoKey = '', t } = this.props;
    const { isMine } = this.state;

    return (
      // in all apps, the main wrapper is setup to allow the padding
      // and margins inside the application. (Just from a consistent pov)
      <main>
        <header>
          <Tabs
            basePath={basePath}
            items={[{
              name: 'index',
              text: t('Sudo access')
            }]}
          />
        </header>

        <KeySelector
          isMine={isMine}
          sudoKey={sudoKey.toString()}
          onChange={this.onAccountChange}
        />
      </main>
    );
  }

  private onAccountChange = (accountId?: string): void => {

  }
}

export default withMulti(
  App,
  translate,
  withCalls<Props>(
    'query.sudo.key'
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
