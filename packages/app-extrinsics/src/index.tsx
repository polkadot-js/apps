// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
import { QueueProps } from '@polkadot/ui-signer/types';
import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import Button from '@polkadot/ui-app/Button';
import { Link } from 'react-router-dom';
import { QueueConsumer } from '@polkadot/ui-signer/Context';
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';

import Selection from './Selection';

type Props = I18nProps & {
  basePath: string,
  accountAll?: Array<any>
};

class ExtrinsicsApp extends React.PureComponent<Props> {
  render () {

    const { accountAll } = this.props;

    if (!accountAll || !Object.keys(accountAll).length) {
      return (
        <div>
          <p>There are no saved accounts. Add some first.</p>
          <Link to='/accounts'>
            <Button
              isPrimary
            >Add Accounts
            </Button>
          </Link>
        </div>
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

export default withObservableBase(accountsObservable.subject, { propName: 'accountAll' })(ExtrinsicsApp);
