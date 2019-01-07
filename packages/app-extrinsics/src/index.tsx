// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus, QueueProps } from '@polkadot/ui-app/Status/types';
import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';
import translate from './translate';

import Selection from './Selection';

type Props = I18nProps & {
  accountAll?: Array<any>,
  basePath: string,
  onStatusChange: (status: ActionStatus) => void
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
          {({ queueExtrinsic, queueUnclog }: QueueProps) => (
            <Selection queueExtrinsic={queueExtrinsic} queueUnclog={queueUnclog} />
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
