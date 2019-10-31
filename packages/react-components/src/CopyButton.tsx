// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, I18nProps } from './types';

import React, { useContext } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import StatusContext from './Status/Context';
import Button from './Button';
import translate from './translate';
import styled from 'styled-components';

interface Props extends BareProps, I18nProps {
  children?: React.ReactNode;
  icon?: string;
  isAddress?: boolean;
  value?: any;
}

function CopyButton ({ children, className, icon = 'copy', isAddress = false, t, value }: Props): React.ReactElement<Props> {
  const { queueAction } = useContext(StatusContext);

  const _onCopy = (): void => {
    isAddress && queueAction && queueAction({
      account: value,
      action: t('clipboard'),
      status: 'queued',
      message: t('address copied')
    });
  };

  return (
    <div className={className}>
      <CopyToClipboard
        onCopy={_onCopy}
        text={value}
      >
        <div className='copyContainer'>
          {children}
          <span className='copySpan'>
            <Button
              className='icon-button'
              icon={icon}
              size='mini'
              isPrimary
            />
          </span>
        </div>
      </CopyToClipboard>
    </div>
  );
}

export default translate(
  styled(CopyButton)`
    cursor: copy;

    button.ui.mini.icon.primary.button.icon-button {
      cursor: copy;
    }

    .copySpan {
      white-space: nowrap;
    }
  `
);
