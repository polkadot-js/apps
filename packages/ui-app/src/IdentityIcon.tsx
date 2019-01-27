// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { IdentityProps } from '@polkadot/ui-identicon/types';
import { QueueProps, QueueAction$Add } from './Status/types';
import { I18nProps } from './types';

import React from 'react';
import { AccountId } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api/with';
import BaseIdentityIcon from '@polkadot/ui-identicon';

import { QueueConsumer } from './Status/Context';
import translate from './translate';

type CopyProps = IdentityProps & I18nProps & {
  queueAction?: QueueAction$Add
};

type IconProps = ApiProps & IdentityProps & {
  session_validators?: Array<AccountId>
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

class IdentityIcon extends React.PureComponent<IconProps & IdentityProps> {
  render () {
    const { session_validators = [], value } = this.props;

    const address = (value || '').toString();
    const isValidator = (session_validators || []).find((validator) =>
      validator.toString() === address
    );

    return (
      <QueueConsumer>
        {({ queueAction }: QueueProps) =>
          <CopyIconI18N
            isHighlight={!!isValidator}
            {...this.props}
            queueAction={queueAction}
          />
        }
      </QueueConsumer>
    );
  }
}

export default withCall('query.session.validators')(IdentityIcon);
