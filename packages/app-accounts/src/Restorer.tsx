// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';

import { accountsQty } from './util/accounts';
import UploadButton from './UploadButton';
import translate from './translate';

type Props = I18nProps & {
  accountAll?: Array<any>,
  onChangeAccount: () => void
};

class Restorer extends React.PureComponent<Props> {
  render () {
    return (
      <div className='accounts--Restorer'>
        {this.renderData()}
      </div>
    );
  }

  private renderData () {
    const { accountAll, onChangeAccount, t } = this.props;

    return (
      <div>
        <div className='accounts--Restorer-message'>
          {t('restorer.existing', {
            defaultValue: 'There are {{count}} saved accounts. {{instruction}}',
            replace: {
              instruction: 'Create an account or upload a JSON file of a saved account.',
              count: accountsQty(accountAll)
            }
          })}
        </div>
        <div className='accounts--Address-wrapper'>
          <div className='accounts--Address-file'>
            <UploadButton onChangeAccount={onChangeAccount} />
          </div>
        </div>
      </div>
    );
  }
}

export {
  Restorer
};

export default withObservableBase(
  accountObservable.subject, { propName: 'accountAll' }
)(translate(Restorer));
