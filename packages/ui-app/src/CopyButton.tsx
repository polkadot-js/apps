// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button$Sizes } from './Button/types';
import { QueueAction$Add } from './Status/types';
import { BareProps, I18nProps } from './types';

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { QueueConsumer } from './Status/Context';
import Button from './Button';
import translate from './translate';

type Props = BareProps & {
  children?: React.ReactNode,
  icon?: string,
  isAddress?: boolean,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  value?: any
};

type InnerProps = Props & I18nProps & {
  queueAction: QueueAction$Add
};

class CopyButtonInner extends React.PureComponent<InnerProps> {
  render () {
    const { children, className, icon = 'copy', isCircular = true, isPrimary = true, size = 'tiny', style, value } = this.props;

    return (
      <div className={className}>
        <CopyToClipboard
          onCopy={this.onCopy}
          text={value}
        >
          <Button
            className='ui--CopyButton'
            icon={icon}
            isCircular={isCircular}
            isPrimary={isPrimary}
            size={size}
            style={style}
          />
        </CopyToClipboard>
        {children}
      </div>
    );
  }

  private onCopy = (): void => {
    const { isAddress = false, queueAction, t, value } = this.props;

    if (isAddress && queueAction) {
      queueAction({
        account: value,
        action: t('clipboard'),
        status: 'queued',
        message: t('address copied')
      });
    }
  }
}

const CopyButtonI18n = translate(CopyButtonInner);

export default class CopyButton extends React.PureComponent<Props> {
  render () {
    return (
      <QueueConsumer>
        {({ queueAction }) => (
          <CopyButtonI18n
            {...this.props}
            queueAction={queueAction}
          />
        )}
      </QueueConsumer>
    );
  }
}
