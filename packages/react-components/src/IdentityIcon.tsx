// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { IdentityProps as Props } from '@polkadot/react-identicon/types';

import React, { useContext, useEffect, useState } from 'react';
import { identityNodes } from '@polkadot/apps-config/ui/identityIcons';
import { useApi, useCall } from '@polkadot/react-hooks';
import BaseIdentityIcon from '@polkadot/react-identicon';
import uiSettings from '@polkadot/ui-settings';
import { ValidatorsContext } from '@polkadot/react-query';

import StatusContext from './Status/Context';
import { useTranslation } from './translate';

export function getIdentityTheme (systemName: string): 'empty' {
  return ((uiSettings.icon === 'default' && identityNodes[systemName.toLowerCase().replace(/-/g, ' ')]) || uiSettings.icon) as 'empty';
}

function IdentityIcon ({ className, onCopy, prefix, size, style, theme, value }: Props): React.ReactElement<Props> {
  const { api, isApiReady, systemName } = useApi();
  const { t } = useTranslation();
  const info = useCall<DeriveAccountInfo>(isApiReady && api.derive.accounts.info as any, [value]);
  const { queueAction } = useContext(StatusContext);
  const validators = useContext(ValidatorsContext);
  const [isValidator, setIsValidator] = useState(false);
  const [address, setAddress] = useState(value?.toString());
  const thisTheme = theme || getIdentityTheme(systemName);

  useEffect((): void => {
    value && setIsValidator(validators.includes(value.toString()));
  }, [value, validators]);

  useEffect((): void => {
    info && setAddress(info.accountId?.toString());
  }, [info]);

  const _onCopy = (account: string): void => {
    onCopy && onCopy(account);
    queueAction && queueAction({
      account,
      action: t('clipboard'),
      status: 'queued',
      message: t('address copied')
    });
  };

  return (
    <BaseIdentityIcon
      className={className}
      isHighlight={isValidator}
      onCopy={_onCopy}
      prefix={prefix}
      size={size}
      style={style}
      theme={thisTheme as 'substrate'}
      value={address}
    />
  );
}

export default React.memo(IdentityIcon);
