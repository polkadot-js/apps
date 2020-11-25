// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

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
  type?: string;
  isMnemonic?: boolean;
  value: string;
}

const NOOP = () => undefined;

function CopyButton ({ children, className = '', icon = 'copy', type, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { queueAction } = useContext(StatusContext);

  const _onCopy = useCallback(
    (): void => {
      (type !== 'other') && queueAction && queueAction({
        account: type !== 'mnemonic' ? value : undefined,
        action: t<string>('clipboard'),
        message: t<string>('{{type}} copied', { replace: { type: type || t<string>('other') } }),
        status: 'queued'
      });
    },
    [type, queueAction, t, value]
  );

  return (
    <div className={`ui--CopyButton ${className}`}>
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
              onClick={NOOP}
            />
          </span>
        </div>
      </CopyToClipboard>
    </div>
  );
}

export default React.memo(styled(CopyButton)`
  .copySpan {
    white-space: nowrap;
  }
`);
