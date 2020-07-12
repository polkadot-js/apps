// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IdentityProps as Props } from '@polkadot/react-identicon/types';

import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { getSystemIcon } from '@polkadot/apps-config/ui';
import { useApi } from '@polkadot/react-hooks';
import BaseIdentityIcon from '@polkadot/react-identicon';
import uiSettings from '@polkadot/ui-settings';

import StatusContext from './Status/Context';
import { useTranslation } from './translate';

export function getIdentityTheme (systemName: string): 'substrate' {
  return ((uiSettings.icon === 'default' && getSystemIcon(systemName)) || uiSettings.icon) as 'substrate';
}

function IdentityIcon ({ className = '', prefix, size = 24, theme, value }: Props): React.ReactElement<Props> {
  const { systemName } = useApi();
  const { t } = useTranslation();
  const { queueAction } = useContext(StatusContext);
  const thisTheme = theme || getIdentityTheme(systemName);

  const _onCopy = useCallback(
    (account: string) => queueAction({
      account,
      action: t('clipboard'),
      message: t('address copied'),
      status: 'queued'
    }),
    [queueAction, t]
  );

  return (
    <BaseIdentityIcon
      className={className}
      onCopy={_onCopy}
      prefix={prefix}
      size={size}
      theme={thisTheme as 'substrate'}
      value={value}
    />
  );
}

export default React.memo(styled(IdentityIcon)`
  border: 1px solid #ddd;
  border-radius: 50%;
  display: inline-block;
`);
