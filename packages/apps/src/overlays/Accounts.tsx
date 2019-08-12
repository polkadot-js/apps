// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { withApi, withMulti, withObservable } from '@polkadot/react-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import translate from '../translate';
import BaseOverlay from './Base';

type Props = I18nProps & ApiProps & {
  allAccounts?: SubjectInfo;
};

interface State {
  hasAccounts: boolean;
  isHidden: boolean;
}

class Accounts extends React.PureComponent<Props, State> {
  public state: State = {
    hasAccounts: false,
    isHidden: false
  };

  public static getDerivedStateFromProps ({ allAccounts }: Props, prevState: State): Pick<State, never> | null {
    if (!allAccounts) {
      return null;
    }

    const hasAccounts = Object.keys(allAccounts).length !== 0;

    if (hasAccounts === prevState.hasAccounts) {
      return null;
    }

    return {
      hasAccounts
    };
  }

  public render (): React.ReactNode {
    const { isApiReady, className, t } = this.props;
    const { hasAccounts, isHidden } = this.state;

    if (!isApiReady || hasAccounts || isHidden) {
      return null;
    }

    return (
      <BaseOverlay
        className={className}
        icon='users'
      >
        <p>{t("You don't have any accounts. Some features are currently hidden and will only become available once you have accounts.")}</p>
        <p>
          <Link
            to='/accounts'
            onClick={this.onClose}
          >
            {t('Create an account now.')}
          </Link>
        </p>
      </BaseOverlay>
    );
  }

  private onClose = (): void => {
    this.setState({ isHidden: true });
  }
}

export default withMulti(
  styled(Accounts as React.ComponentClass<Props>)`
    background: #fff6cb;
    border-color: #e7c000;
    color: #6b5900;
  `,
  translate,
  withApi,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
