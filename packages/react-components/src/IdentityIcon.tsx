// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getSystemIcon } from '@canvas-ui/app-config/ui';
import { useApi, useNotification } from '@canvas-ui/react-hooks';
import { ValidatorsContext } from './BlockAuthors';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import BaseIdentityIcon from '@polkadot/react-identicon';
import { IdentityProps as Props } from '@polkadot/react-identicon/types';
import uiSettings from '@polkadot/ui-settings';

import { useTranslation } from './translate';

function getIdentityTheme (systemName: string): 'substrate' {
  return ((uiSettings.icon === 'default' && getSystemIcon(systemName)) || uiSettings.icon) as 'substrate';
}

function IdentityIcon ({ className = '', onCopy, prefix, size = 24, theme, value }: Props): React.ReactElement<Props> {
  const { systemName } = useApi();
  const { t } = useTranslation();
  const showNotification = useNotification();
  const validators = useContext(ValidatorsContext);
  const [isValidator, setIsValidator] = useState(false);
  const [address, setAddress] = useState(value?.toString());
  const thisTheme = theme || getIdentityTheme(systemName);

  useEffect((): void => {
    value && setIsValidator(
      validators.includes(value.toString())
    );
    value && setAddress(value.toString());
  }, [value, validators]);

  const _onCopy = useCallback(
    (account: string): void => {
      onCopy && onCopy(account);
      showNotification({
        account,
        action: 'clipboard',
        message: t<string>('address copied to clipboard'),
        status: 'queued'
      });
    },
    [onCopy, showNotification, t]
  );

  return (
    <div className={`ui--IdentityIcon-Outer ${className}`}>
      <BaseIdentityIcon
        isHighlight={isValidator}
        onCopy={_onCopy}
        prefix={prefix}
        size={size}
        theme={thisTheme as 'substrate'}
        value={address}
      />
    </div>
  );
}

export default React.memo(styled(IdentityIcon)`
  .ui--IdentityIcon {
    display: block;
  }

  .container:before {
    box-shadow: none !important;
    background: var(--white) !important;
  }
`);
