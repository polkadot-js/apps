// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IconName } from '@fortawesome/fontawesome-svg-core';

import React, { useCallback, useContext } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import StatusContext from './Status/Context';
import Button from './Button';
import { useTranslation } from './translate';
import styled from 'styled-components';

interface Props {
  children?: React.ReactNode;
  className?: string;
  icon?: IconName;
  isAddress?: boolean;
  value: string;
}

function CopyButton ({ children, className, icon = 'copy', isAddress = false, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { queueAction } = useContext(StatusContext);

  const _onCopy = useCallback(
    (): void => {
      isAddress && queueAction && queueAction({
        account: value,
        action: t<string>('clipboard'),
        message: t<string>('address copied'),
        status: 'queued'
      });
    },
    [isAddress, queueAction, t, value]
  );

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
              className='icon-button show-on-hover'
              icon={icon}
            />
          </span>
        </div>
      </CopyToClipboard>
    </div>
  );
}

export default React.memo(styled(CopyButton)`
  cursor: copy;

  button.u.ui--Icon.primary.button.icon-button {
    cursor: copy;
  }

  .copySpan {
    white-space: nowrap;
  }
`);
