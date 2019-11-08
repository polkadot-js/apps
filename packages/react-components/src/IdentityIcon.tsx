// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { IdentityProps } from '@polkadot/react-identicon/types';
import { I18nProps } from './types';

import React, { useContext, useEffect, useState } from 'react';
import { ApiContext, withCalls, withMulti } from '@polkadot/react-api';
import BaseIdentityIcon from '@polkadot/react-identicon';
import uiSettings from '@polkadot/ui-settings';

import StatusContext from './Status/Context';
import translate from './translate';

interface Props extends IdentityProps, I18nProps {
  validators?: AccountId[];
}

// overrides based on the actual software node type
const NODES: Record<string, string> = {
  'edgeware-node': 'substrate',
  'joystream-node': 'beachball',
  'node-template': 'substrate',
  'parity-polkadot': 'polkadot',
  'polkadot-js': 'polkadot',
  'substrate-node': 'substrate'
};

export function getIdentityTheme (systemName: string): 'empty' {
  return ((uiSettings.icon === 'default' && NODES[systemName]) || uiSettings.icon) as 'empty';
}

function IdentityIcon ({ className, onCopy, prefix, size, style, t, theme, validators, value }: Props): React.ReactElement<Props> {
  const { systemName } = useContext(ApiContext);
  const { queueAction } = useContext(StatusContext);
  const [address, setAddress] = useState<string | undefined>();
  const [isValidator, setIsValidator] = useState(false);
  const thisTheme = theme || getIdentityTheme(systemName);

  useEffect((): void => {
    setAddress(value?.toString());
  }, [value]);

  useEffect((): void => {
    setIsValidator(
      validators
        ? validators.some((validator): boolean => validator.toString() === address)
        : false
    );
  }, [address, validators]);

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

export default withMulti(
  IdentityIcon,
  translate,
  withCalls<Props>(
    ['derive.staking.validators', {
      propName: 'validators',
      transform: ({ validators }): AccountId[] => validators
    }]
  )
);
