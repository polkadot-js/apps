// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AbiConstructor, ContractCallOutcome } from '@polkadot/api-contract/types';

import React, { useCallback } from 'react';

import { Button, Output, styled } from '@polkadot/react-components';
import valueToText from '@polkadot/react-params/valueToText';

import { useTranslation } from '../translate.js';
import MessageSignature from './MessageSignature.js';

export interface Props {
  className?: string;
  index: number;
  lastResult?: ContractCallOutcome;
  message: AbiConstructor;
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
    <StyledDiv
      className={`${className} ${!onSelect ? 'exempt-hover' : ''} ${message.isConstructor ? 'constructor' : ''}`}
      key={`${message.identifier}-${index}`}
    >
      {onSelect && (
        message.isConstructor
          ? (
            <Button
              className='accessory'
              icon='upload'
              label={t('deploy')}
              onClick={_onSelect}
            />
          )
          : (
            <Button
              className='accessory'
              icon='play'
              isDisabled={message.isMutating ? false : (!message.args.length && lastResult?.result.isOk)}
              label={message.isMutating ? t('exec') : t('read')}
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
            : <i>&nbsp;{t('No documentation provided')}&nbsp;</i>
          }
        </div>
      </div>
      {lastResult && lastResult.result.isOk && lastResult.output && (
        <Output
          className='result'
          isFull
          label={t('current value')}
        >
          {valueToText('Text', lastResult.output)}
        </Output>
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
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
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-normal);
    }
  }

  .result {
    min-width: 15rem;
  }

  &+& {
    margin-top: 0.5rem;
  }
`;

export default React.memo(Message);
