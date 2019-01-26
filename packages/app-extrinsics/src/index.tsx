// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueProps } from '@polkadot/ui-app/Status/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/ui-api/index';
import translate from './translate';

import Selection from './Selection';

type Props = AppProps & I18nProps & {
  accountAll?: Array<any>
};

class ExtrinsicsApp extends React.PureComponent<Props> {
  render () {

    const { accountAll, onStatusChange, t } = this.props;

    if (!accountAll || !Object.keys(accountAll).length) {
      return (
        <main className='extrinsics--App'>
          {t('There are no saved accounts. ')}
          <Link to='/accounts'>
            {t('Add Accounts.')}
          </Link>
        </main>
      );
    }

    return (
      <main className='extrinsics--App'>
        <QueueConsumer>
          {({ queueExtrinsic }: QueueProps) => (
            <Selection onStatusChange={onStatusChange} queueExtrinsic={queueExtrinsic} />
          )}
        </QueueConsumer>
      </main>
    );
  }
}

export { ExtrinsicsApp };

export default withMulti(
  ExtrinsicsApp,
  translate,
  withObservable(accountsObservable.subject, { propName: 'accountAll' })
);
