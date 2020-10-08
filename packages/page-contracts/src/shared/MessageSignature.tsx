// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AbiMessage, AbiConstructor, AbiType } from '@polkadot/api-contract/types';

import React from 'react';
import styled from 'styled-components';
import { Icon, Tooltip } from '@polkadot/react-components';
import { displayType } from '@polkadot/types';

import { useTranslation } from '../translate';

const MAX_PARAM_LENGTH = 20;

export interface Props {
  asConstructor?: boolean;
  className?: string;
  message: AbiMessage | AbiConstructor;
  params?: any[];
  withTooltip?: boolean;
}

function truncate (param: string): string {
  return param.length > MAX_PARAM_LENGTH
    ? `${param.substring(0, MAX_PARAM_LENGTH / 2)}…${param.substring(param.length - MAX_PARAM_LENGTH / 2)}`
    : param;
}

function MessageSignature ({ className, message, params = [], asConstructor = false, withTooltip = false }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <span className='ui--MessageSignature-name'>{message.identifier}</span>
      {' '}({message.args.map(({ name, type }, index): React.ReactNode => {
        return (
          <React.Fragment key={`${name}-args-${index}`}>
            {name}:
            {' '}
            <span className='ui--MessageSignature-type'>
              {params && params[index]
                ? <b>{truncate((params as string[])[index].toString())}</b>
                : displayType(type)
              }
            </span>
            {index < (message.args.length) - 1 && ', '}
          </React.Fragment>
        );
      })})
      {(!asConstructor && (message as AbiMessage).returnType) && (
        <>
          :
          {' '}
          <span className='ui--MessageSignature-returnType'>
            {displayType((message as AbiMessage).returnType as AbiType)}
          </span>
        </>
      )}
      {(message as AbiMessage).isMutating && (
        <>
          <Icon
            className='ui--MessageSignature-mutates'
            icon='database'
            tooltip={`mutates-${message.identifier}`}
          />
          {withTooltip && (
            <Tooltip
              text={t<string>('Mutates contract state')}
              trigger={`mutates-${message.identifier}`}
            />
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(
  styled(MessageSignature)`
    font-family: monospace;
    font-weight: normal;
    flex-grow: 1;

    .ui--MessageSignature-mutates {
      color: #ff8600;
      margin-left: 0.5rem;
      opacity: 0.6;
    }

    .ui--MessageSignature-name {
      color: #2f8ddb;
      font-weight: bold;
    }

    .ui--MessageSignature-type {
      color: #21a2b2;
    }

    .ui--MessageSignature-returnType {
      color: #ff8600;
    }
  `
);
