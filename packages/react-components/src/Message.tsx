// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { classes } from '@canvas-ui/react-util';
import { VoidFn } from '@canvas-ui/react-util/types';
import Tippy from '@tippyjs/react';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { followCursor } from 'tippy.js';

import { AbiMessage } from '@polkadot/api-contract/types';
import { Registry } from '@polkadot/types/types';

import { ELEV_3_CSS } from './styles/constants';
import Button from './Button';
import Docs from './Docs';
import MessageSignature from './MessageSignature';
import { useTranslation } from './translate';
import { BareProps } from './types';

interface Props extends BareProps {
  isConstructor?: boolean;
  onSelect?: VoidFn;
  message: AbiMessage;
  registry: Registry;
}

// const Tooltip = styled(ReactTooltip)`
//   background: transparent !important;
//   opacity: 1 !important;
//   padding: 0 !important;
//   margin: 0 !important;
// `;

function Message ({ className, isConstructor, message, onSelect, registry }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { docs, identifier } = message;

  const signature = useMemo(
    (): React.ReactNode => (
      <MessageSignature
        isConstructor={isConstructor}
        message={message}
        registry={registry}
        withTooltip
      />
    ),
    [isConstructor, message, registry]
  );

  return (
    <div
      className={classes(className, !onSelect && 'exempt-hover', isConstructor && 'isConstructor')}
      key={identifier}
    >
      <Tippy
        animation='fade'
        arrow={false}
        content={
          <Docs
            docs={docs}
            signature={signature}
          />
        }
        interactive
        offset={[30, 0]}
        placement='bottom-start'
        plugins={[followCursor]}
        theme='transparent'
        trigger='mouseenter'
      >
        <div style={{ height: '100%', padding: '0.5rem 1rem', width: '100%' }}>
          {signature}
          {!isConstructor && onSelect && (
            <div className='accessory'>
              <Button
                className='execute'
                icon={isConstructor ? 'cloud-upload' : 'play'}
                onClick={onSelect}
                tooltip={t<string>(isConstructor ? 'Instantiate with this constructor' : 'Call this message')}
              />
            </div>
          )}
        </div>
      </Tippy>
    </div>
  );
}

export default React.memo(styled(Message)`
  ${ELEV_3_CSS}
  cursor: help;
  display: inline-flex;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background-color: var(--grey30);
  }

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  &.constructor {
  }

  &.disabled {
    opacity: 1 !important;
    background: #eee !important;
    color: #555 !important;
  }

  .accessory {
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;

    .execute {
      display: none;
      background: transparent !important;
      font-size: 1.5rem;
      margin: 0;
      padding: 0;
    }
  }

  &:hover {
    .accessory .execute {
      display: block;
      color: rgba(0, 0, 0, 0.2);

      &:hover {
        color: #2e86ab;
      }
    }
  }

  .info {
    flex: 1 1;

    .docs {
      font-size: 0.8rem;
      font-weight: normal;
    }
  }
`);
