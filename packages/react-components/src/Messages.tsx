// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIMessage } from '@polkadot/api-contract/types';
import { Button } from '@polkadot/react-components';

import React from 'react';
import styled from 'styled-components';
import { Abi } from '@polkadot/api-contract';

import IconLink from './IconLink';
import MessageSignature from './MessageSignature';
import { useTranslation } from './translate';
import { classes } from './util';

export interface Props {
  address?: string;
  className?: string;
  contractAbi: Abi;
  isLabelled?: boolean;
  isRemovable: boolean;
  onRemove?: () => void;
  onSelect?: (messageIndex: number) => () => void;
  onSelectConstructor?: (constructorIndex: number) => void;
  withConstructors?: boolean;
}

const NOOP = (): void => undefined;

function onSelect (props: Props, messageIndex: number): () => void {
  return function (): void {
    const { address: callAddress, contractAbi: { abi: { contract: { messages } } }, onSelect } = props;

    if (!callAddress || !messages || !messages[messageIndex]) {
      return;
    }

    onSelect && onSelect(messageIndex)();
  };
}

function onSelectConstructor (props: Props, index: number): () => void {
  return function (): void {
    const { contractAbi: { abi: { contract: { constructors } } }, onSelectConstructor } = props;

    if (!constructors || !constructors[index]) {
      return;
    }

    onSelectConstructor && onSelectConstructor(index);
  };
}

function renderItem (props: Props, message: ContractABIMessage, index: number, asConstructor = false): React.ReactNode {
  const { t } = useTranslation();
  const { docs = [], name } = message;

  return (
    <div
      key={name}
      className={classes('message', !onSelect && 'exempt-hover', asConstructor && 'constructor')}
    >
      <div className='info'>
        <MessageSignature
          asConstructor={asConstructor}
          message={message}
          withTooltip
        />
        <details className='docs'>
          <summary>
            {
              docs && docs.length > 0
                ? docs
                  .filter((line) => line !== '')
                  .map((line, index) => ((
                    <React.Fragment key={`${name}-docs-${index}`}>
                      <span>{line}</span>
                      <br />
                    </React.Fragment>
                  )))
                : (
                  <i>{t('No documentation provided')}</i>
                )
            }
          </summary>
        </details>
      </div>
      {!asConstructor && props.onSelect && (
        <div className='accessory'>
          <Button
            className='execute'
            icon='play'
            onClick={onSelect(props, index)}
            tooltip={t('Call this message')}
          />
        </div>
      )}
      {asConstructor && props.onSelectConstructor && (
        <div className='accessory'>
          <Button
            className='execute'
            icon='cloud upload'
            onClick={onSelectConstructor(props, index)}
            tooltip={t('Deploy with this constructor')}
          />
        </div>
      )}
    </div>
  );
}

function renderConstructor (props: Props, index: number): React.ReactNode {
  const { contractAbi: { abi: { contract: { constructors } } } } = props;

  if (!constructors[index]) {
    return null;
  }

  return renderItem(props, constructors[index], index, true);
}

function renderMessage (props: Props, index: number): React.ReactNode {
  const { contractAbi: { abi: { contract: { messages } } } } = props;

  if (!messages[index]) {
    return null;
  }

  return renderItem(props, messages[index], index);
}

function Messages (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { className, contractAbi: { abi: { contract: { constructors, messages } } }, isLabelled, isRemovable, onRemove = NOOP, withConstructors } = props;

  return (
    <div className={classes(className, 'ui--Messages', isLabelled && 'labelled')}>
      {withConstructors && constructors.map((_, index): React.ReactNode => renderConstructor(props, index))}
      {messages.map((_, index): React.ReactNode => renderMessage(props, index))}
      {isRemovable && (
        <IconLink
          label={t('Remove ABI')}
          icon='remove'
          className='remove-abi'
          onClick={onRemove}
        />
      )}
    </div>
  );
}

export default styled(Messages)`
  font-size: 0.9rem;
  padding: 0;
  margin: 0;

  .remove-abi {
    float: right;

    &:hover, &:hover :not(i) {
      text-decoration: underline;
    }
  }

  &.labelled {
    background: white;
    box-sizing: border-box;
    border: 1px solid rgba(34,36,38,.15);
    border-radius: .28571429rem;
    padding: 1rem 1rem 0.5rem;
    width: 100%;
  }

  & .message {
    width: calc(100% - 1rem);
    background: #f8f8f8;
    display: inline-flex;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.7rem;
    transition: all 0.2s;

    &.constructor {
      background: #e8f4ff;
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

    .accessory {
      width: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .execute {
        display: none;
        background: transparent;
        font-size: 1.5rem;
        margin: 0;
        padding: 0;
      }
    }

    &.disabled {
      opacity: 1 !important;
      background: #eee !important;
      color: #555 !important;
    }
  }
`;
