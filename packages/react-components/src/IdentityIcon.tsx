/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { ApiProps } from '@polkadot/react-api/types';
import { IdentityProps } from '@polkadot/react-identicon/types';
import { QueueAction$Add } from './Status/types';
import { I18nProps } from './types';

import React from 'react';
import { Option } from '@polkadot/types';
import { withCalls } from '@polkadot/react-api/with';
import BaseIdentityIcon from '@polkadot/react-identicon';

import { QueueConsumer } from './Status/Context';
import translate from './translate';

type CopyProps = IdentityProps & I18nProps & {
  queueAction?: QueueAction$Add;
};

type IconProps = ApiProps & IdentityProps & {
  session_validators?: AccountId[];
  staking_bonded?: Option<AccountId>;
};

type Props = IconProps & IdentityProps;

interface State {
  isValidator: boolean;
}

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
    isValidator: false
  };

  public static getDerivedStateFromProps ({ session_validators = [], staking_bonded, value }: Props, prevState: State): State | null {
    const address = value
      ? value.toString()
      : null;
    const bonded = staking_bonded && staking_bonded.isSome
      ? staking_bonded.unwrap().toString()
      : null;
    const isValidator = !!session_validators.find((validator): boolean =>
      [address, bonded].includes(validator.toString())
    );

    return prevState.isValidator !== isValidator
      ? { isValidator }
      : null;
  }

  public render (): React.ReactNode {
    const { isValidator } = this.state;

    return (
      <QueueConsumer>
        {({ queueAction }): React.ReactNode =>
          <CopyIconI18N
            isHighlight={isValidator}
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
  ['query.staking.bonded', { paramName: 'value' }]
)(IdentityIcon);
