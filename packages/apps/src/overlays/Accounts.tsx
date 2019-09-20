// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { withApi, withMulti, withObservable } from '@polkadot/react-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import translate from '../translate';
import BaseOverlay from './Base';

interface Props extends I18nProps, ApiProps {
  allAccounts?: SubjectInfo;
}

function Accounts ({ allAccounts, isApiReady, className, t }: Props): React.ReactElement<Props> | null {
  const [hasAccounts, setHasAccounts] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect((): void => {
    if (!allAccounts) {
      return;
    }

    const newHas = Object.keys(allAccounts).length !== 0;

    if (newHas !== hasAccounts) {
      setHasAccounts(newHas);
    }
  }, [allAccounts]);

  const _onClose = (): void => setIsHidden(true);

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
          onClick={_onClose}
        >
          {t('Create an account now.')}
        </Link>
      </p>
    </BaseOverlay>
  );
}

export default withMulti(
  styled(Accounts)`
    background: #fff6cb;
    border-color: #e7c000;
    color: #6b5900;
  `,
  translate,
  withApi,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
