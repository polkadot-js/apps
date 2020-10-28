// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IdentityProps } from '@polkadot/react-identicon/types';

import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { getSystemIcon } from '@polkadot/apps-config/ui';
import { useApi } from '@polkadot/react-hooks';
import BaseIdentityIcon from '@polkadot/react-identicon';
import uiSettings from '@polkadot/ui-settings';

import StatusContext from '../Status/Context';
import { useTranslation } from '../translate';
import RoboHash from './RoboHash';

interface Props {
  className?: string;
  prefix?: IdentityProps['prefix'];
  size?: number;
  theme?: IdentityProps['theme'] | 'robohash';
  value?: string | Uint8Array | null;
}

export function getIdentityTheme (systemName: string): 'substrate' {
  return ((uiSettings.icon === 'default' && getSystemIcon(systemName)) || uiSettings.icon) as 'substrate';
}

function IdentityIcon ({ className = '', prefix, size = 24, theme, value }: Props): React.ReactElement<Props> {
  const { systemName } = useApi();
  const { t } = useTranslation();
  const { queueAction } = useContext(StatusContext);
  const thisTheme = theme || getIdentityTheme(systemName);
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
