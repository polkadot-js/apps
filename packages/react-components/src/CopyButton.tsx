// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-common-types';

import { useNotification } from '@canvas-ui/react-hooks';
import { truncate } from '@canvas-ui/react-util';
import React, { useCallback } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
// import { IconProps } from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import styled from 'styled-components';

import Button from './Button';
import { useTranslation } from './translate';
import { BareProps } from './types';

interface Props extends BareProps {
  children?: React.ReactNode;
  className?: string;
  icon?: IconName;
  isAddress?: boolean;
  // size?: IconProps['size'];
  value: string;
  withButton: boolean;
}

function CopyButton ({ children, className, icon = 'copy', isAddress = false, value, withButton = true }: Props): React.ReactElement<Props> {
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

  button.u.svg-inline--fa.primary.button.icon-button {
    cursor: copy;
    position: relative;
    top: 2px;
  }

  .copySpan {
    white-space: nowrap;
  }
`);
