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

function onSelect (props: Props, index: number): () => void {
  return function (): void {
    const { address: callAddress, contractAbi: { abi: { messages }, isV2, registry }, onSelect } = props;

    if (!callAddress || !messages || !messages[index]) {
      return;
    }

    const { name: callMethod } = messages[index];

    onSelect && onSelect(callAddress, isV2 ? registry.stringAt(callMethod as number) : callMethod as string);
  };
}

function renderMessage (props: Props, index: number): React.ReactNode {
  console.log(props.contractAbi);
  const { contractAbi: { abi: { messages }, isV2, registry }, onSelect: onSelectProp } = props;
  if (!messages[index]) {
    return null;
  }

  const { args, name, return_type: returnType } = messages[index];
  return (
    <Button
      key={name}
      className={classes('message', !onSelect && 'exempt-hover')}
      isDisabled={!onSelectProp}
      onClick={onSelect(props, index)}
      isPrimary={!!onSelectProp}
    >
      {isV2 ? registry.stringAt(name as number) : name}
      (
      {args.map(({ name, type }): string => isV2 ? `${registry.stringAt(name as number)}: ${(registry.typeDefAt(type as number) || { type: '' }).type}` : `${name}: ${type}`).join(', ')}
      )
      {returnType && `: ${isV2 ? registry.typeDefAt(returnType as number).type : returnType}`}
    </Button>
  );
}

function Messages (props: Props): React.ReactElement<Props> {
  const { className, contractAbi: { abi: { messages } }, isLabelled, isRemovable, onRemove = (): void => { /* . */ }, onSelect, t } = props;
  return (
    <div className={classes(className, 'ui--Messages', isLabelled && 'labelled', onSelect && 'select')}>
      {messages.map((_, index): React.ReactNode => {
        return renderMessage(props, index);
      })}
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
    font-family: monospace;
    font-weight: normal;
    margin-bottom: 0;
    margin-right: 0;
    padding: 0.5rem;
    margin: 0;
    /* border-radius: 0.7rem; */

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
