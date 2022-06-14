// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IdentityProps } from '@polkadot/react-identicon/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';

import { getSystemIcon } from '@polkadot/apps-config';
import { ThemeProps } from '@polkadot/react-components/types';
import { useApi } from '@polkadot/react-hooks';
import BaseIdentityIcon from '@polkadot/react-identicon';
import { settings } from '@polkadot/ui-settings';

import StatusContext from '../Status/Context';
import { useTranslation } from '../translate';
import RoboHash from './RoboHash';

interface Props {
  className?: string;
  prefix?: IdentityProps['prefix'];
  size?: number;
  theme?: IdentityProps['theme'] | 'robohash';
  value?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

export function getIdentityTheme (systemName: string, specName: string): 'substrate' {
  return ((settings.icon === 'default' && getSystemIcon(systemName, specName)) || settings.icon) as 'substrate';
}

function isCodec (value?: AccountId | AccountIndex | Address | string | Uint8Array | null): value is AccountId | AccountIndex | Address {
  return !!(value && (value as AccountId).toHuman);
}

function IdentityIcon ({ className = '', prefix, size = 24, theme, value }: Props): React.ReactElement<Props> {
  const { isEthereum, specName, systemName } = useApi();
  const { t } = useTranslation();
  const { queueAction } = useContext(StatusContext);
  const thisTheme = theme || getIdentityTheme(systemName, specName);
  const Custom = thisTheme === 'robohash'
    ? RoboHash
    : undefined;

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
      Custom={Custom}
      className={className}
      onCopy={_onCopy}
      prefix={prefix}
      size={size}
      theme={isEthereum ? 'ethereum' : thisTheme as 'substrate'}
      value={isCodec(value) ? value.toString() : value}
    />
  );
}

export default React.memo(styled(IdentityIcon)(({ theme }: ThemeProps) => `
  ${theme.theme === 'dark'
    ? `circle:first-child {
      fill: #282829;
    }`
    : ''}

  border: 1px solid ${theme.theme === 'dark' ? 'transparent' : '#ddd'};
  border-radius: 50%;
  display: inline-block;
  overflow: hidden;
`));
