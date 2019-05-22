// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { withApi, withMulti, withObservable } from '@polkadot/ui-api';
import { Icon } from '@polkadot/ui-app';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import { Accounts as Wrapper, OverlayClose } from '../styles';

import translate from '../translate';

type Props = I18nProps & ApiProps & {
  allAccounts?: SubjectInfo
};

type State = {
  isDismissed: boolean,
  hasAccounts: boolean
};

class Accounts extends React.PureComponent<Props, State> {
  state: State = {
    isDismissed: false,
    hasAccounts: false
  };

  static getDerivedStateFromProps ({ allAccounts }: Props, prevState: State): State | null {
    if (!allAccounts) {
      return null;
    }

    const hasAccounts = Object.keys(allAccounts).length !== 0;

    if (hasAccounts === prevState.hasAccounts) {
      return null;
    }

    return {
      hasAccounts
    } as State;
  }

  render () {
    const { isApiReady } = this.props;
    const { isDismissed, hasAccounts } = this.state;

    if (!isApiReady || isDismissed || hasAccounts) {
      return null;
    }

    return (
      <Wrapper>
        <Trans i18nKey='noAccounts'>
          You have no accounts. Some features are currently hidden and will only become available once you have accounts.
          {' '}
          <Link
            to ='/accounts'
            onClick={this.dismiss}
          >
            Create an account now.
          </Link>
        </Trans>
        <OverlayClose>
          <Icon
            name='close'
            onClick={this.dismiss}
          />
        </OverlayClose>
      </Wrapper>
    );
  }

  private dismiss = () => {
    this.setState({ isDismissed: true });
  }
}

export default withMulti(
  Accounts,
  translate,
  withApi,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
