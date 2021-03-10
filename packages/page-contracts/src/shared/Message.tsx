// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AbiConstructor, AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import { Button, Output } from '@polkadot/react-components';
import valueToText from '@polkadot/react-params/valueToText';

import { useTranslation } from '../translate';
import MessageSignature from './MessageSignature';

export interface Props {
  className?: string;
  index: number;
  lastResult?: ContractCallOutcome;
  message: AbiConstructor | AbiMessage;
  onSelect?: (index: number) => void;
}

function filterDocs (docs: string[]): string[] {
  let skip = false;

  return docs
    .map((line) => line.trim())
    .filter((line) => line)
    .filter((line, index): boolean => {
      if (skip) {
        return false;
      } else if (index || line.startsWith('#')) {
        skip = true;

        return false;
      }

      return true;
    });
}

function Message ({ className = '', index, lastResult, message, onSelect }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const _onSelect = useCallback(
    () => onSelect && onSelect(index),
    [index, onSelect]
  );

  return (
    <div
      className={`${className} ${!onSelect ? 'exempt-hover' : ''} ${message.isConstructor ? 'constructor' : ''}`}
      key={`${message.identifier}-${index}`}
    >
      {onSelect && (
        message.isConstructor
          ? (
            <Button
              className='accessory'
              icon='upload'
              label={t<string>('deploy')}
              onClick={_onSelect}
            />
          )
          : (
            <Button
              className='accessory'
              icon='play'
              isDisabled={message.isMutating ? false : (!message.args.length && lastResult?.result.isOk)}
              label={message.isMutating ? t<string>('exec') : t<string>('read')}
              onClick={_onSelect}
            />
          )
      )}
      <div className='info'>
        <MessageSignature
          asConstructor={message.isConstructor}
          message={message}
          withTooltip
        />
        <div className='docs'>
          {message.docs.length
            ? filterDocs(message.docs).map((line, index) => ((
              <div key={`${message.identifier}-docs-${index}`}>{line}</div>
            )))
            : <i>&nbsp;{t<string>('No documentation provided')}&nbsp;</i>
          }
        </div>
      </div>
      {lastResult && lastResult.result.isOk && lastResult.output && (
        <Output
          className='result'
          isFull
          label={t<string>('current value')}
        >
          {valueToText('Text', lastResult.output)}
        </Output>
      )}
    </div>
  );
}

export default React.memo(styled(Message)`
  align-items: center;
  border-radius: 0.25rem;
  display: flex;
  padding: 0.25rem 0.75rem 0.25rem 0;

  &.disabled {
    opacity: 1 !important;
    background: #eee !important;
    color: #555 !important;
  }

  .info {
    flex: 1 1;
    margin-left: 1.5rem;

    .docs {
      font-size: 0.9rem;
      font-weight: var(--font-weight-normal);
    }
  }

  .result {
    min-width: 15rem;
  }

  &+& {
    margin-top: 0.5rem;
  }
`);
