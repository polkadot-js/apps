/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { IdentityProps } from '@polkadot/react-identicon/types';
import { QueueAction$Add } from './Status/types';
import { I18nProps } from './types';

import React from 'react';
import { Option } from '@polkadot/types';
import { withCalls } from '@polkadot/react-api/with';
import BaseIdentityIcon from '@polkadot/react-identicon';
import uiSettings, { ICON_DEFAULT_HOST } from '@polkadot/ui-settings';

import { QueueConsumer } from './Status/Context';
import translate from './translate';

interface CopyProps extends IdentityProps, I18nProps {
  queueAction?: QueueAction$Add;
}

interface IconProps extends IdentityProps {
  session_validators?: AccountId[];
  staking_bonded?: string | null;
  system_name?: string;
}

interface Props extends IconProps, IdentityProps {}

interface State {
  isValidator: boolean;
  theme: string;
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

class CopyIcon extends React.PureComponent<CopyProps> {
  public render (): React.ReactNode {
    return (
      <BaseIdentityIcon
        {...this.props}
        onCopy={this.onCopy}
      />
    );
  }

  private onCopy = (account: string): void => {
    const { onCopy, queueAction, t } = this.props;

    if (onCopy) {
      onCopy(account);
    }

    if (queueAction) {
      queueAction({
        account,
        action: t('clipboard'),
        status: 'queued',
        message: t('address copied')
      });
    }
  }
}

const CopyIconI18N = translate(CopyIcon);

class IdentityIcon extends React.PureComponent<Props, State> {
  public state: State = {
    isValidator: false,
    theme: ICON_DEFAULT_HOST
  };

  public static getDerivedStateFromProps ({ session_validators = [], staking_bonded, system_name, value }: Props): State {
    const address = value
      ? value.toString()
      : null;
    const isValidator = !!session_validators.find((validator): boolean =>
      [address, staking_bonded].includes(validator.toString())
    );

    return {
      isValidator,
      theme: (system_name && uiSettings.icon === 'default' && NODES[system_name]) || uiSettings.icon
    };
  }

  public render (): React.ReactNode {
    const { isValidator, theme } = this.state;

    return (
      <QueueConsumer>
        {({ queueAction }): React.ReactNode =>
          <CopyIconI18N
            isHighlight={isValidator}
            theme={theme as 'substrate'}
            {...this.props}
            queueAction={queueAction}
          />
        }
      </QueueConsumer>
    );
  }
}

export default withCalls<Props>(
  'query.session.validators',
  ['query.staking.bonded', {
    paramName: 'value',
    transform: (bonded: Option<AccountId>): string | null =>
      bonded.unwrapOr(NULL_TOSTRING).toString()
  }],
  ['rpc.system.name', {
    transform: (node: Text): string =>
      node.toString()
  }]
)(IdentityIcon);
