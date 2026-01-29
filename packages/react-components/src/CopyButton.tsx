// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import React, { useCallback } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { useQueue } from '@polkadot/react-hooks';
import { isString } from '@polkadot/util';

import Button from './Button/index.js';
import { styled } from './styled.js';
import { useTranslation } from './translate.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  icon?: IconName;
  label?: React.ReactNode;
  type?: string;
  isMnemonic?: boolean;
  value?: React.ReactNode | null;
}

const NOOP = () => undefined;

function CopyButton ({ children, className = '', icon = 'copy', label, type, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { queueAction } = useQueue();

  const _onCopy = useCallback(
    (): void => {
      queueAction && queueAction({
        action: t('clipboard'),
        message: t('{{type}} copied', { replace: { type: type || t('value') } }),
        status: 'queued'
      });
    },
    [type, queueAction, t]
  );

  if (!isString(value)) {
    return null;
  }

  return (
    <StyledDiv className={`${className} ui--CopyButton`}>
      <CopyToClipboard
        onCopy={_onCopy}
        text={value as string}
      >
        <div className='copyContainer'>
          {children}
          <span className='copySpan'>
            <Button
              className='icon-button show-on-hover'
              icon={icon}
              isDisabled={!value}
              label={label}
              onClick={NOOP}
            />
          </span>
        </div>
      </CopyToClipboard>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .copySpan {
    white-space: nowrap;
  }
`;

export default React.memo(CopyButton);
