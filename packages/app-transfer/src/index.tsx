// Copyright 2017-2018 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Trans } from 'react-i18next';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';

import './index.css';

import Transfer from './Transfer';
import translate from './translate';

type Props = I18nProps & {
  allAccounts?: Array<any>
};

type State = {
};

class App extends React.PureComponent<Props, State> {
  render () {
    return (
      <main className='transfer--App'>
        {this.renderBody()}
      </main>
    );
  }

  private renderBody () {
    const { allAccounts } = this.props;

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
      <Transfer />
    );
  }
}

export default withObservableBase(
  accountObservable.subject, { propName: 'allAccounts' }
)(translate(App));
