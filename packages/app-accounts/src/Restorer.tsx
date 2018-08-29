// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';

import UploadButton from './UploadButton';
import translate from './translate';

type Props = I18nProps & {
  accountAll?: Array<any>,
  onBack: () => void
};

class Restorer extends React.PureComponent<Props> {
  constructor (props: Props) {
    super(props);
  }

  render () {
    return (
      <div className='accounts--Restorer'>
        {this.renderData()}
      </div>
    );
  }

  renderData () {
    const { accountAll, t } = this.props;

    const isNoAccounts = !accountAll || !Object.keys(accountAll).length;
    let accountsQty = !isNoAccounts && accountAll ? Object.keys(accountAll).length : 0;

    return (
      <div>
        <div>
          {t('restorer.existing', {
            defaultValue: `There are ${accountsQty} saved accounts. Create an account or upload a JSON file of a saved account.`
          })}
        </div>
        <div className='accounts--Address-wrapper'>
          <div className='accounts--Address-file'>
            <UploadButton onChangeAccount={this.onChangeAccount} />
          </div>
        </div>
      </div>
    );
  }

  onChangeAccount = (publicKey: Uint8Array): void => {
    const { onBack } = this.props;

    onBack();
  }
}

export {
  Restorer
};

export default withObservableBase(
  accountObservable.subject, { propName: 'accountAll' }
)(translate(Restorer));
