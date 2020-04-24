// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Link } from 'react-router-dom';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import BaseOverlay from './Base';

interface Props {
  className?: string;
}

function Accounts ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { isApiReady } = useApi();
  const [isHidden, toggleHidden] = useToggle();

  if (!isApiReady || hasAccounts || isHidden) {
    return null;
  }

  return (
    <BaseOverlay
      className={className}
      icon='users'
      type='info'
    >
      <p>{t("You don't have any accounts. Some features are currently hidden and will only become available once you have accounts.")}</p>
      <p>
        <Link
          onClick={toggleHidden}
          to='/accounts'
        >
          {t('Create an account now.')}
        </Link>
      </p>
    </BaseOverlay>
  );
}

export default React.memo(Accounts);
