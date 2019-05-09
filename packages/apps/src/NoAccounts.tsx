// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import { Link } from 'react-router-dom';
import { withApi, withMulti, withObservable } from '@polkadot/ui-api';
import { Icon } from '@polkadot/ui-app';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import translate from './translate';

import { NoAccounts as Wrapper, NoticeClose } from './styles';

type Props = I18nProps & ApiProps & {
  allAccounts?: SubjectInfo
};

type State = {
  isOpen: boolean
};

class Connecting extends React.PureComponent<Props> {
  state: State = {
    isOpen: true
  };

  render () {
    const { allAccounts, isApiConnected, t } = this.props;
    const { isOpen } = this.state;
    const hasAddresses = allAccounts && Object.keys(allAccounts).length !== 0;

    if (!isOpen || hasAddresses || !isApiConnected) {
      return null;
    }

    return (
      <Wrapper>
        <div>
          {t('You have not created any accounts on this blockchain. ')}
          <Link
            to='/accounts'
            onClick={this.close}
          >
            {t('View Accounts')}
          </Link>
        </div>
        <NoticeClose
        >
          <Icon
            name='close'
            onClick={this.close}
          />
        </NoticeClose>
      </Wrapper>
    );
  }

  private close = () => {
    this.setState({ isOpen: false });
  }
}

export default withMulti(
  Connecting,
  translate,
  withApi,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
