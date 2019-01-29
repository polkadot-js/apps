// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import { Trans } from 'react-i18next';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/ui-api/index';
import { Tabs } from '@polkadot/ui-app/index';

import './index.css';

import Transfer from './Transfer';
import translate from './translate';

type Props = AppProps & I18nProps & {
  allAccounts?: SubjectInfo
};

class App extends React.PureComponent<Props> {
  render () {
    return (
      <main className='transfer--App'>
        {this.renderBody()}
      </main>
    );
  }

  private renderBody () {
    const { allAccounts, basePath, t } = this.props;

    if (!allAccounts || !Object.keys(allAccounts).length) {
      return (
        <div className='transfer--App-no-accounts'>
          <Trans i18nKey='no-accounts'>
            You currently have no active accounts. Before you are able to transfer, add <a href='#/accounts'>an account</a>.
          </Trans>
        </div>
      );
    }

    return (
      <>
        <header>
          <Tabs
            basePath={basePath}
            items={[{
              name: 'create',
              text: t('Balance transfer')
            }]}
          />
        </header>
        <Transfer />
      </>
    );
  }
}

export default withMulti(
  App,
  translate,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
