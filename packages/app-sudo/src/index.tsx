// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import { Tabs } from '@polkadot/ui-app';
import { withApi, withCall, withMulti, withObservable } from '@polkadot/ui-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import './index.css';

import KeySelector from './KeySelector';
import Propose from './Propose';

import translate from './translate';

type Props = AppProps & ApiProps & I18nProps & {
  allAccounts?: SubjectInfo,
  sudo_key?: string
};

type State = {
  isMine: boolean
};

class App extends React.PureComponent<Props, State> {
  state: State = {
    isMine: false
  };

  static getDerivedStateFromProps ({ allAccounts = {}, sudo_key }: Props): State | null {
    return {
      isMine: !!sudo_key && !!Object.keys(allAccounts).find((key) => key === sudo_key.toString())
    };
  }

  render () {
    const { allAccounts = {}, basePath, sudo_key: sudoKey = '', t } = this.props;
    const { isMine } = this.state;

    return (
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
          allAccounts={allAccounts}
          isMine={isMine}
          sudoKey={sudoKey}
        />
        <Propose
          isMine={isMine}
          sudoKey={sudoKey}
        />
      </main>
    );
  }
}

export default withMulti(
  App,
  translate,
  withApi,
  withCall(
    'query.sudo.key', { transform: key => key.toString() }
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
