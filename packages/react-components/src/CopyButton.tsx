// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProps } from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import { BareProps } from './types';

import React, { useCallback } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useNotification } from '@canvas-ui/react-hooks';
import { truncate } from '@canvas-ui/react-util';

import Button from './Button';
import { useTranslation } from './translate';
import styled from 'styled-components';

interface Props extends BareProps {
  children?: React.ReactNode;
  className?: string;
  icon?: string;
  isAddress?: boolean;
  size?: IconProps['size'];
  value: string;
  withButton: boolean;
}

function CopyButton ({ children, className, icon = 'copy outline', isAddress = false, size = 'small', value, withButton = true }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const showNotification = useNotification();

  const _onCopy = useCallback(
    (): void => {
      showNotification({
        account: isAddress ? value : undefined,
        action: truncate(value),
        message: isAddress ? t<string>('address copied to clipboard') : t('copied to clipboard'),
        status: 'queued'
      });
    },
    [isAddress, showNotification, t, value]
  );

  return (
    <div className={className}>
      <CopyToClipboard
        onCopy={_onCopy}
        text={value}
      >
        <div className='copyContainer'>
          {children}
          {withButton && (
            <span className='copySpan'>
              <Button
                className='icon-button show-on-hover'
                icon={icon}
                isIcon
                isPrimary
                size={size}
              />
            </span>
          )}
        </div>
      </CopyToClipboard>
    </div>
  );
}

export default React.memo(styled(CopyButton)`
  cursor: copy;
  display: inline-block;

  button.ui.icon.primary.button.icon-button {
    cursor: copy;
    position: relative;
    top: 2px;
  }

  .copySpan {
    white-space: nowrap;
  }
`);
