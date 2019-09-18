// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { Button } from '@polkadot/react-components';

import React from 'react';
import styled from 'styled-components';
import { Abi } from '@polkadot/api-contract';

import translate from './translate';
import { classes } from './util';

export interface Props extends I18nProps {
  address?: string;
  contractAbi: Abi;
  isLabelled?: boolean;
  isRemovable: boolean;
  onRemove?: () => void;
  onSelect?: (callAddress?: string, callMethod?: string) => void;
}

const NOOP = (): void => {};

function onSelect (props: Props, index: number): () => void {
  return function (): void {
    const { address: callAddress, contractAbi, contractAbi: { abi: { contract: { messages } } }, onSelect } = props;

    if (!callAddress || !messages || !messages[index]) {
      return;
    }

    const { name: callMethod } = messages[index];

    onSelect && onSelect(callAddress, contractAbi.stringAt(callMethod));
  };
}

function renderMessage (props: Props, index: number): React.ReactNode {
  const { contractAbi, contractAbi: { abi: { contract: { messages } } } } = props;
  if (!messages[index]) {
    return null;
  }

  const { args, docs = [], name, return_type: returnType } = messages[index];
  return (
    <div
      key={name}
      className={classes('message', !onSelect && 'exempt-hover')}
      onClick={onSelect(props, index)}
    >
      <div className="signature">
        <span className="name">
          {contractAbi.stringAt(name)}
        </span>
        (
        {args.map(({ name, type }, index): React.ReactNode => ((
          <>
            {contractAbi.stringAt(name)}:
            {' '}
            <span className='type'>
              {contractAbi.typeDefAt(type).type}
            </span>
            {index < args.length - 1 && ', '}
          </>
        )))}
        )
        {returnType && (
          <>
            :
            {' '}
            <span className="return-type">
              {contractAbi.typeDefAt(returnType).type}
            </span>
          </>
        )}
      </div>
      <div className="docs">
        {docs.map((line, index) => ((
          <>
            {line}
            {index < docs.length - 1 && (
              <br />
            )}
          </>
        )))}
      </div>
    </div>
  );
}

function Messages (props: Props): React.ReactElement<Props> {
  const { className, contractAbi: { abi: { contract: { messages } } }, isLabelled, isRemovable, onRemove = NOOP, onSelect, t } = props;
  return (
    <div className={classes(className, 'ui--Messages', isLabelled && 'labelled', onSelect && 'select')}>
      {messages.map((_, index): React.ReactNode => renderMessage(props, index))}
      {isRemovable && (
        <Button
          className='iconButton'
          icon='remove'
          onClick={onRemove}
          size='tiny'
          isNegative
          tooltip={t('Remove ABI')}
        />
      )}
    </div>
  );
}

export default translate(styled(Messages)`
  font-size: 0.9rem;
  min-height: 3.5rem;
  padding: 0;
  margin: 0;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;

  &.labelled {
    background: white;
    box-sizing: border-box;
    border: 1px solid rgba(34,36,38,.15);
    border-radius: .28571429rem;
    padding: 1rem 1rem 0.5rem;
    width: 100%;
  }

  & > .message {
    background: #f2f2f2;
    cursor: pointer;
    margin-bottom: 0.5rem;
    margin-right: 0;
    height: 5rem;
    padding: 0.5rem;
    border-radius: 0.7rem;
    transition: all 0.2s;

    &:hover {
      background: #ededed;
    }

    .signature {
      font-family: monospace;
      font-weight: normal;

      .name {
        /* color: #61afef; */
        font-weight: bold;
      }

      .type {
        /* color: #56b6c2; */
      }

      .return-type {
        /* color: #ffbb15; */
      }
    }

    .docs {
      font-size: 0.8rem;
      font-weight: normal;
    }

    &.disabled {
      opacity: 1 !important;
      background: #eee !important;
      color: #555 !important;
    }

    &:not(:last-of-type) {
      margin-right: 0.5rem;
    }
  }
`);
