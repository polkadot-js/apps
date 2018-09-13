// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
import { QueueProps } from '@polkadot/ui-signer/types';
import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { QueueConsumer } from '@polkadot/ui-signer/Context';
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';
import translate from './translate';

import Selection from './Selection';

type Props = I18nProps & {
  basePath: string,
  accountAll?: Array<any>
};

class ExtrinsicsApp extends React.PureComponent<Props> {
  render () {

    const { accountAll, t } = this.props;

    if (!accountAll || !Object.keys(accountAll).length) {
      return (
        <main className='extrinsics--App'>
          {t('accounts.none', {
            defaultValue: 'There are no saved accounts. '
          })}
          <Link to='/accounts'>
          Add Accounts.
          </Link>
        </main>
      );
    }

    return (
      <main className='extrinsics--App'>
        <QueueConsumer>
          {({ queueAdd }: QueueProps) => (
            <Selection queueAdd={queueAdd} />
          )}
        </QueueConsumer>
      </main>
    );
  }
}

export { ExtrinsicsApp };

export default withObservableBase(accountsObservable.subject, { propName: 'accountAll' })(translate(ExtrinsicsApp));
