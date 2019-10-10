// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIMethod } from '@polkadot/api-contract/types';
import { I18nProps } from '@polkadot/react-components/types';
import { Button } from '@polkadot/react-components';

import React from 'react';
import styled from 'styled-components';
import { Abi } from '@polkadot/api-contract';
import { displayType } from '@polkadot/types';

import Icon from './Icon';
import Tooltip from './Tooltip';
import translate from './translate';
import { classes } from './util';

export interface Props extends I18nProps {
  address?: string;
  contractAbi: Abi;
  isLabelled?: boolean;
  isRemovable: boolean;
  onRemove?: () => void;
  onSelect?: (callAddress?: string, callMethod?: string) => void;
  onSelectConstructor?: (index: number) => void;
  withConstructors?: boolean;
}

const NOOP = (): void => {};

function onSelect (props: Props, index: number): () => void {
  return function (): void {
    const { address: callAddress, contractAbi: { abi: { contract: { messages } } }, onSelect } = props;

    if (!callAddress || !messages || !messages[index]) {
      return;
    }

    const { name } = messages[index];

    onSelect && onSelect(callAddress, name);
  };
}

function onSelectConstructor (props: Props, index: number): () => void {
  return function (): void {
    const { contractAbi: { abi: { contract: { constructors } } }, onSelectConstructor } = props;

    if (!constructors || !constructors[index]) {
      return;
    }
    console.log(onSelectConstructor);
    onSelectConstructor && onSelectConstructor(index);
  };
}

function renderItem (props: Props, { args, docs = [], mutates, name, returnType }: ContractABIMethod, index: number, asConstructor = false): React.ReactNode {
  return (
    <div
      key={name}
      className={classes('message', !onSelect && 'exempt-hover', asConstructor && 'constructor')}
    >
      <div className="info">
        <div className="signature">
          <span className="name">
            {name}
          </span>
          (
          {args.map(({ name, type }, index): React.ReactNode => {
            return (
              <React.Fragment key={`${name}-args-${index}`}>
                {name}:
                {' '}
                <span className='type'>
                  {displayType(type)}
                </span>
                {index < args.length - 1 && ', '}
              </React.Fragment>
            );
          })}
          )
          {(!asConstructor && returnType) && (
            <>
              :
              {' '}
              <span className="return-type">
                {displayType(returnType)}
              </span>
            </>
          )}
          {mutates && (
            <>
              <Icon
                data-tip
                data-for={`mutates-${name}`}
                name="database"
                className="mutates"
              />
              <Tooltip
                trigger={`mutates-${name}`}
                text={props.t('Mutates contract state')}
              />
            </>
          )}
        </div>
        <details className="docs">
          <summary>
            {
              docs
                .filter((line) => line !== '')
                .map((line, index) => ((
                  <React.Fragment key={`${name}-docs-${index}`}>
                    <span>{line}</span>
                    <br />
                  </React.Fragment>
                )))
            }
          </summary>
        </details>
      </div>
      {!asConstructor && props.onSelect && (
        <div className="accessory">
          <Button
            className="execute"
            icon="play"
            onClick={onSelect(props, index)}
            tooltip={props.t('Call this message')}
          />
        </div>
      )}
      {asConstructor && props.onSelectConstructor && (
        <div className="accessory">
          <Button
            className="execute"
            icon="cloud upload"
            onClick={onSelectConstructor(props, index)}
            tooltip={props.t('Deploy with this constructor')}
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
  const { className, contractAbi: { abi: { contract: { constructors, messages } } }, isLabelled, isRemovable, onRemove = NOOP, withConstructors } = props;
  return (
    <div className={classes(className, 'ui--Messages', isLabelled && 'labelled')}>
      {withConstructors && constructors.map((_, index): React.ReactNode => renderConstructor(props, index))}
      {messages.map((_, index): React.ReactNode => renderMessage(props, index))}
      {isRemovable && (
        <a
          className='remove-abi'
          onClick={onRemove}
        >
          <Icon name='remove' />
          Remove ABI
        </a>
      )}
    </div>
  );
}

export default translate(styled(Messages)`
  font-size: 0.9rem;
  padding: 0;
  margin: 0;

  .remove-abi {
    float: right;

    &:hover {
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

      .signature {
        font-family: monospace;
        font-weight: normal;

        .name {
          color: #2f8ddb;
          font-weight: bold;
        }

        .type {
          color: #21a2b2;
        }

        .return-type {
          color: #ff8600;
        }
      }

      .docs {
        font-size: 0.8rem;
        font-weight: normal;
      }

      .mutates {
        color: #ff8600;
        margin-left: 0.5rem;
        opacity: 0.6;
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
`);
