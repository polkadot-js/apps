// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IdentityProps } from '@polkadot/ui-identicon/types';
import { QueueProps, QueueAction$Add } from './Status/types';
import { I18nProps } from './types';

import React from 'react';
import BaseIdentityIcon from '@polkadot/ui-identicon';

import { QueueConsumer } from './Status/Context';
import translate from './translate';

type CopyProps = IdentityProps & I18nProps & {
  queueAction?: QueueAction$Add
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

  private onCopy = (value: string): void => {
    const { onCopy, queueAction, t } = this.props;

    if (onCopy) {
      onCopy(value);
    }

    if (queueAction) {
      queueAction({
        action: t('identicon.copy', {
          defaultValue: 'clipboard'
        }),
        status: 'queued',
        value: value,
        message: t('identicon.copied', {
          defaultValue: 'address copied'
        })
      });
    }
  }
}

const CopyIconI18N = translate(CopyIcon);

export default class IdentityIcon extends React.PureComponent<IdentityProps> {
  render () {
    return (
      <QueueConsumer>
        {({ queueAction }: QueueProps) =>
          <CopyIconI18N
            {...this.props}
            queueAction={queueAction}
          />
        }
      </QueueConsumer>
    );
  }
}
