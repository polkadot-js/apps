// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { IdentityProps } from '@polkadot/ui-identicon/types';
import { QueueAction$Add } from './Status/types';
import { I18nProps } from './types';

import React from 'react';
import { AccountId, Option } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api/with';
import BaseIdentityIcon from '@polkadot/ui-identicon';

import { QueueConsumer } from './Status/Context';
import translate from './translate';

type CopyProps = IdentityProps & I18nProps & {
  queueAction?: QueueAction$Add
};

type IconProps = ApiProps & IdentityProps & {
  session_validators?: Array<AccountId>,
  staking_bonded?: Option<AccountId>
};

type Props = IconProps & IdentityProps;

type State = {
  isValidator: boolean
};

class CopyIcon extends React.PureComponent<CopyProps> {
  render () {
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
  state: State = {
    isValidator: false
  };

  static getDerivedStateFromProps ({ session_validators = [], staking_bonded, value }: Props, prevState: State): State | null {
    const address = value
      ? value.toString()
      : null;
    const bonded = staking_bonded && staking_bonded.isSome
      ? staking_bonded.unwrap().toString()
      : null;
    const isValidator = !!session_validators.find((validator) =>
      [address, bonded].includes(validator.toString())
    );

    return prevState.isValidator !== isValidator
      ? { isValidator }
      : null;
  }

  render () {
    const { isValidator } = this.state;

    return (
      <QueueConsumer>
        {({ queueAction }) =>
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
