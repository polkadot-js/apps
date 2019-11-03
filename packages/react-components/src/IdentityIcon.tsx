/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingValidators } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';
import { IdentityProps } from '@polkadot/react-identicon/types';
import { I18nProps } from './types';

import React, { useContext, useEffect, useState } from 'react';
import { Option } from '@polkadot/types';
import { ApiContext, withCalls, withMulti } from '@polkadot/react-api';
import BaseIdentityIcon from '@polkadot/react-identicon';
import uiSettings from '@polkadot/ui-settings';

import StatusContext from './Status/Context';
import translate from './translate';

interface Props extends IdentityProps, I18nProps {
  staking_bonded?: string | null;
  system_name?: string;
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

// toString() => null
const NULL_TOSTRING = {
  toString: (): null => null
};

export function getIdentityTheme (systemName: string): 'empty' {
  return ((uiSettings.icon === 'default' && NODES[systemName]) || uiSettings.icon) as 'empty';
}

function IdentityIcon ({ className, onCopy, prefix, size, staking_bonded, style, t, theme, validators, value }: Props): React.ReactElement<Props> {
  const { systemName } = useContext(ApiContext);
  const { queueAction } = useContext(StatusContext);
  const [isValidator, setIsValidator] = useState(false);
  const thisTheme = theme || getIdentityTheme(systemName);

  useEffect((): void => {
    const address = value
      ? value.toString()
      : null;

    setIsValidator(
      validators
        ? validators.some((validator): boolean =>
          [address, staking_bonded].includes(validator.toString())
        )
        : false
    );
  }, [validators, value]);

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
      value={value}
    />
  );
}

export default withMulti(
  IdentityIcon,
  translate,
  withCalls<Props>(
    ['derive.staking.validators', {
      propName: 'validators',
      transform: ({ validators }): DeriveStakingValidators => validators
    }],
    ['query.staking.bonded', {
      paramName: 'value',
      transform: (bonded: Option<AccountId>): string | null =>
        bonded.unwrapOr(NULL_TOSTRING).toString()
    }]
  )
);
