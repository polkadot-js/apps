// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { IdentityProps } from '@polkadot/react-identicon/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React, { useCallback } from 'react';

import { getSystemIcon } from '@polkadot/apps-config';
import { useApi, useQueue } from '@polkadot/react-hooks';
import BaseIdentityIcon from '@polkadot/react-identicon';
import { settings } from '@polkadot/ui-settings';

import { useTranslation } from '../translate.js';
import RoboHash from './RoboHash/index.js';

interface Props {
  className?: string;
  forceIconType?: 'ethereum' | 'substrate';
  prefix?: IdentityProps['prefix'];
  size?: number;
  theme?: IdentityProps['theme'] | 'robohash';
  value?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

export function getIdentityTheme (apiEndpoint: LinkOption | null, systemName: string, specName: string): 'substrate' {
  return (
    (settings.icon === 'default' && (
      apiEndpoint?.ui?.identityIcon ||
      getSystemIcon(systemName, specName)
    )) ||
    settings.icon
  ) as 'substrate';
}

function isCodec (value?: AccountId | AccountIndex | Address | string | Uint8Array | null): value is AccountId | AccountIndex | Address {
  return !!(value && (value as AccountId).toHuman);
}

function IdentityIcon ({ className = '', forceIconType, prefix, size = 24, theme, value }: Props): React.ReactElement<Props> {
  const { apiEndpoint, isEthereum, specName, systemName } = useApi();
  const { t } = useTranslation();
  const { queueAction } = useQueue();
  const thisTheme = theme || getIdentityTheme(apiEndpoint, systemName, specName);

  const Custom = thisTheme === 'robohash'
    ? RoboHash
    : undefined;

  const onCopy = useCallback(
    (account: string) => queueAction({
      account,
      action: t('clipboard'),
      message: t('address copied'),
      status: 'queued'
    }),
    [queueAction, t]
  );

  // NOTE ui--Identicon-React-Base is applied here (defined in styles/components.ts)
  // since it has a theme and the styled wrapper overrides it

  return (
    <BaseIdentityIcon
      Custom={Custom}
      className={`ui--Identicon-React-Base ${className}`}
      onCopy={onCopy}
      prefix={prefix}
      size={size}
      theme={forceIconType || (isEthereum ? 'ethereum' : thisTheme as 'substrate')}
      value={isCodec(value) ? value.toString() : value}
    />
  );
}

export default React.memo(IdentityIcon);
