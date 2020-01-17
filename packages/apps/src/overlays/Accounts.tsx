// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import BaseOverlay from './Base';

interface Props {
  className?: string;
}

function Accounts ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { isApiReady } = useApi();
  const [isHidden, setIsHidden] = useState(false);

  if (!isApiReady || hasAccounts || isHidden) {
    return null;
  }

  const _onClose = (): void => setIsHidden(true);

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

export default styled(Accounts)`
  background: #fff6cb;
  border-color: #e7c000;
  color: #6b5900;
`;
